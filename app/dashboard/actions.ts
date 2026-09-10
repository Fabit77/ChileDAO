"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export async function acceptCurrentPolicies() {
  const user = await requireUser();
  const acceptedAt = new Date();
  await db.$transaction([
    db.user.update({ where: { id: user.id }, data: { termsAcceptedAt: acceptedAt, privacyAcceptedAt: acceptedAt } }),
    db.activity.create({ data: { actorId: user.id, type: "POLICIES_ACCEPTED", metadata: { policyVersion: "2026-09-10" } } }),
  ]);
  revalidatePath("/dashboard", "layout");
}
