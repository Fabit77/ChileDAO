"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth/session";
import { checkRateLimit } from "@/lib/security";

const userSchema = z.object({ userId: z.string().cuid() });
const badgeAssignmentSchema = z.object({ userId: z.string().cuid(), badgeId: z.string().cuid() });
const badgeSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().min(5).max(240),
  icon: z.string().trim().min(1).max(12),
});

function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function refreshAdmin() {
  revalidatePath("/admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin/badges");
  revalidatePath("/admin/superadmins");
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/badges");
  revalidatePath("/members");
}

async function actorAndTarget(formData: FormData) {
  const actor = await requireSuperAdmin();
  checkRateLimit(`admin:${actor.id}`, 30);
  const parsed = userSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return null;
  const target = await db.user.findUnique({ where: { id: parsed.data.userId }, include: { profile: true } });
  return target ? { actor, target } : null;
}

export async function verifyProfile(formData: FormData) {
  const context = await actorAndTarget(formData);
  if (!context || !context.target.profile || context.target.deactivatedAt) return;
  if (context.target.role !== "CANDIDATE" && context.target.role !== "QUALIFIED") return;

  await db.$transaction([
    db.user.update({ where: { id: context.target.id }, data: { role: "MEMBER", membershipSource: "FOUNDING", memberSince: new Date() } }),
    db.activity.create({ data: { actorId: context.actor.id, type: "FOUNDING_MEMBER_VERIFIED", entityId: context.target.id, metadata: { previousRole: context.target.role, source: "FOUNDING" } } }),
  ]);
  refreshAdmin();
}

export async function deactivateAccount(formData: FormData) {
  const context = await actorAndTarget(formData);
  if (!context || context.target.id === context.actor.id || context.target.deactivatedAt) return;

  await db.$transaction([
    db.user.update({ where: { id: context.target.id }, data: { deactivatedAt: new Date() } }),
    db.activity.create({ data: { actorId: context.actor.id, type: "ACCOUNT_DEACTIVATED", entityId: context.target.id, metadata: { previousRole: context.target.role } } }),
  ]);
  refreshAdmin();
}

export async function reactivateAccount(formData: FormData) {
  const context = await actorAndTarget(formData);
  if (!context || !context.target.deactivatedAt) return;

  await db.$transaction([
    db.user.update({ where: { id: context.target.id }, data: { deactivatedAt: null } }),
    db.activity.create({ data: { actorId: context.actor.id, type: "ACCOUNT_REACTIVATED", entityId: context.target.id } }),
  ]);
  refreshAdmin();
}

export async function promoteSuperAdmin(formData: FormData) {
  const context = await actorAndTarget(formData);
  if (!context || !context.target.profile || context.target.deactivatedAt || context.target.role === "SUPER_ADMIN") return;
  const needsBootstrap = context.target.role === "CANDIDATE" || context.target.role === "QUALIFIED";

  await db.$transaction([
    db.user.update({
      where: { id: context.target.id },
      data: {
        role: "SUPER_ADMIN",
        membershipSource: needsBootstrap ? "FOUNDING" : context.target.membershipSource,
        memberSince: context.target.memberSince ?? new Date(),
      },
    }),
    db.activity.create({ data: { actorId: context.actor.id, type: "SUPER_ADMIN_GRANTED", entityId: context.target.id, metadata: { previousRole: context.target.role } } }),
  ]);
  refreshAdmin();
}

export async function removeSuperAdmin(formData: FormData) {
  const context = await actorAndTarget(formData);
  if (!context || context.target.id === context.actor.id || context.target.role !== "SUPER_ADMIN") return;

  await db.$transaction([
    db.user.update({ where: { id: context.target.id }, data: { role: "MEMBER" } }),
    db.activity.create({ data: { actorId: context.actor.id, type: "SUPER_ADMIN_REMOVED", entityId: context.target.id, metadata: { newRole: "MEMBER" } } }),
  ]);
  refreshAdmin();
}

export async function createBadge(formData: FormData) {
  const actor = await requireSuperAdmin();
  checkRateLimit(`admin:${actor.id}`, 30);
  const parsed = badgeSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const slug = slugify(parsed.data.name);
  if (!slug) return;

  try {
    const badge = await db.badge.create({ data: { ...parsed.data, slug, criteriaType: "MANUAL", criteria: {}, isAutomatic: false } });
    await db.activity.create({ data: { actorId: actor.id, type: "BADGE_CREATED", entityId: badge.id, metadata: { name: badge.name } } });
  } catch {
    return;
  }
  refreshAdmin();
}

export async function awardBadge(formData: FormData) {
  const actor = await requireSuperAdmin();
  checkRateLimit(`admin:${actor.id}`, 30);
  const parsed = badgeAssignmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const [target, badge, existing] = await Promise.all([
    db.user.findFirst({ where: { id: parsed.data.userId, deactivatedAt: null, profile: { isNot: null }, role: { in: ["MEMBER", "TRUSTED_MEMBER", "ADMIN", "SUPER_ADMIN"] } }, select: { id: true } }),
    db.badge.findUnique({ where: { id: parsed.data.badgeId }, select: { id: true, name: true } }),
    db.userBadge.findUnique({ where: { userId_badgeId: parsed.data }, select: { id: true } }),
  ]);
  if (!target || !badge || existing) return;

  await db.$transaction([
    db.userBadge.create({ data: { ...parsed.data, awardedBy: actor.id } }),
    db.activity.create({ data: { actorId: actor.id, type: "BADGE_AWARDED", entityId: target.id, metadata: { badgeId: badge.id, badgeName: badge.name } } }),
  ]);
  refreshAdmin();
}

export async function revokeBadge(formData: FormData) {
  const actor = await requireSuperAdmin();
  checkRateLimit(`admin:${actor.id}`, 30);
  const parsed = badgeAssignmentSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const assignment = await db.userBadge.findUnique({ where: { userId_badgeId: parsed.data }, include: { badge: { select: { name: true } } } });
  if (!assignment) return;

  await db.$transaction([
    db.userBadge.delete({ where: { id: assignment.id } }),
    db.activity.create({ data: { actorId: actor.id, type: "BADGE_REVOKED", entityId: parsed.data.userId, metadata: { badgeId: parsed.data.badgeId, badgeName: assignment.badge.name } } }),
  ]);
  refreshAdmin();
}
