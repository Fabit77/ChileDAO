"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/session";

const profileSchema = z.object({
  displayName: z.string().trim().min(2).max(80),
  username: z.string().trim().toLowerCase().regex(/^[a-z0-9_-]{2,30}$/),
  headline: z.string().trim().max(120).optional(),
  location: z.string().trim().max(80).optional(),
  bio: z.string().trim().max(500).optional(),
});

export async function createProfile(formData: FormData) {
  const user = await requireUser();
  if (user.profile) redirect("/dashboard");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/join?error=invalid-profile");
  const { username, ...profile } = parsed.data;
  try {
    await db.$transaction([
      db.profile.create({ data: { userId: user.id, username, slug: username, ...profile, githubUrl: user.githubUsername ? `https://github.com/${user.githubUsername}` : null } }),
      db.activity.create({ data: { actorId: user.id, type: "PROFILE_CREATED", metadata: { username } } }),
    ]);
  } catch {
    redirect("/join?error=username-taken");
  }
  redirect("/dashboard");
}

export async function updateProfile(formData: FormData) {
  const user = await requireUser();
  if (!user.profile) redirect("/join");
  const parsed = profileSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) redirect("/dashboard/profile?error=invalid-profile");

  const { username, ...profile } = parsed.data;
  try {
    await db.$transaction([
      db.profile.update({
        where: { userId: user.id },
        data: { ...profile, username, slug: username },
      }),
      db.activity.create({
        data: {
          actorId: user.id,
          type: "PROFILE_UPDATED",
          metadata: { previousUsername: user.profile.username, username },
        },
      }),
    ]);
  } catch {
    redirect("/dashboard/profile?error=username-taken");
  }

  redirect("/dashboard/profile?saved=true");
}
