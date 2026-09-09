"use server";

import { MembershipRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireSuperAdmin } from "@/lib/auth/session";

const roleSchema = z.object({ username: z.string().trim().toLowerCase().min(2).max(30), role: z.enum(["MEMBER", "ADMIN", "SUPER_ADMIN"]) });

export async function assignPlatformRole(formData: FormData) {
  const actor = await requireSuperAdmin();
  const parsed = roleSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const target = await db.user.findFirst({ where: { profile: { is: { username: parsed.data.username } } }, select: { id: true, role: true } });
  if (!target) return;
  if (target.id === actor.id && parsed.data.role !== "SUPER_ADMIN") return;
  const founding = (target.role === "CANDIDATE" || target.role === "QUALIFIED") && ["MEMBER", "ADMIN", "SUPER_ADMIN"].includes(parsed.data.role);
  await db.$transaction([
    db.user.update({ where: { id: target.id }, data: { role: MembershipRole[parsed.data.role], membershipSource: founding ? "FOUNDING" : undefined, memberSince: founding ? new Date() : undefined } }),
    db.activity.create({ data: { actorId: actor.id, type: "PLATFORM_ROLE_ASSIGNED", entityId: target.id, metadata: { previousRole: target.role, newRole: parsed.data.role } } }),
  ]);
  revalidatePath("/admin");
  revalidatePath("/members");
}
