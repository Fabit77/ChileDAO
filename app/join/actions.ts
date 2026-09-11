"use server";

import { Prisma } from "@prisma/client";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { isReservedUsername, nextUsernameChangeAt, normalizeUsername } from "@/lib/domain/username";
import { checkRateLimit } from "@/lib/security";
import { PUBLIC_CACHE_TAGS } from "@/lib/data/public-cache";

const profileDetailsSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  headline: z.string().trim().max(120).optional(),
  location: z.string().trim().max(80).optional(),
  bio: z.string().trim().max(500).optional(),
});
const profileSchema = profileDetailsSchema.extend({ username: z.string().transform(normalizeUsername).pipe(z.string().regex(/^[a-z0-9_-]{2,30}$/)) });
const createProfileSchema = profileSchema.extend({ acceptPolicies: z.literal("on") });

function isUniqueConflict(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function lockUsername(tx: Prisma.TransactionClient, username: string) {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${username}))`;
}

async function usernameOwner(tx: Prisma.TransactionClient, username: string) {
  const [current, historic] = await Promise.all([
    tx.profile.findUnique({ where: { username }, select: { id: true } }),
    tx.profileUsernameHistory.findUnique({ where: { username }, select: { profileId: true } }),
  ]);
  return current?.id ?? historic?.profileId ?? null;
}

export async function createProfile(formData: FormData) {
  const user = await requireUser();
  checkRateLimit(`profile-create:${user.id}`, 5);
  if (user.profile) redirect("/dashboard");
  const parsed = createProfileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/join?error=invalid-profile");
  const username = parsed.data.username;
  const profile = profileDetailsSchema.parse(parsed.data);
  if (isReservedUsername(username)) redirect("/join?error=username-reserved");

  let errorCode: "username-taken" | "database" | null = null;
  try {
    await db.$transaction(async (tx) => {
      await lockUsername(tx, username);
      if (await usernameOwner(tx, username)) throw new Error("USERNAME_TAKEN");
      await tx.profile.create({ data: { userId: user.id, username, slug: username, ...profile, githubUrl: user.githubUsername ? `https://github.com/${user.githubUsername}` : null } });
      await tx.user.update({ where: { id: user.id }, data: { termsAcceptedAt: new Date(), privacyAcceptedAt: new Date() } });
      await tx.activity.create({ data: { actorId: user.id, type: "PROFILE_CREATED", metadata: { username, policyVersion: "2026-09-10" } } });
    });
  } catch (error) {
    errorCode = isUniqueConflict(error) || (error instanceof Error && error.message === "USERNAME_TAKEN") ? "username-taken" : "database";
  }
  if (errorCode) redirect(`/join?error=${errorCode}`);
  updateTag(PUBLIC_CACHE_TAGS.members);
  redirect("/dashboard");
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  checkRateLimit(`profile-update:${user.id}`, 10);
  if (!user.profile) redirect("/join");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/profile?error=invalid-profile");

  const { username, ...profile } = parsed.data;
  const usernameChanged = username !== user.profile.username;
  if (usernameChanged && isReservedUsername(username)) redirect("/dashboard/profile?error=username-reserved");
  const nextChange = usernameChanged ? nextUsernameChangeAt(user.profile.usernameChangedAt) : null;
  if (nextChange) redirect(`/dashboard/profile?error=username-cooldown&until=${encodeURIComponent(nextChange.toISOString())}`);

  let errorCode: "username-taken" | "database" | null = null;
  try {
    await db.$transaction(async (tx) => {
      if (usernameChanged) {
        await lockUsername(tx, username);
        const owner = await usernameOwner(tx, username);
        if (owner && owner !== user.profile?.id) throw new Error("USERNAME_TAKEN");
        await tx.profileUsernameHistory.upsert({
          where: { username: user.profile!.username },
          update: {},
          create: { profileId: user.profile!.id, username: user.profile!.username },
        });
      }
      await tx.profile.update({
        where: { userId: user.id },
        data: { ...profile, username, slug: username, ...(usernameChanged ? { usernameChangedAt: new Date() } : {}) },
      });
      await tx.activity.create({
        data: { actorId: user.id, type: "PROFILE_UPDATED", metadata: { previousUsername: user.profile!.username, username, usernameChanged } },
      });
    });
  } catch (error) {
    errorCode = isUniqueConflict(error) || (error instanceof Error && error.message === "USERNAME_TAKEN") ? "username-taken" : "database";
  }
  if (errorCode) redirect(`/dashboard/profile?error=${errorCode}`);
  updateTag(PUBLIC_CACHE_TAGS.members);
  redirect("/dashboard/profile?saved=true");
}
