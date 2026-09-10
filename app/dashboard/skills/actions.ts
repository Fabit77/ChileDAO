"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/security";

export async function updateDeclaredSkills(formData: FormData) {
  const user = await requireUser();
  checkRateLimit(`skills:${user.id}`, 10);
  if (!user.profile) return;
  const parsed = z.array(z.string().cuid()).max(20).safeParse(formData.getAll("skillId"));
  if (!parsed.success) return;
  const selected = [...new Set(parsed.data)];
  const validCount = await db.skill.count({ where: { id: { in: selected } } });
  if (validCount !== selected.length) return;

  await db.$transaction(async (tx) => {
    await tx.userSkill.deleteMany({ where: { userId: user.id, evidenceLevel: "SELF_DECLARED", id: { notIn: (await tx.userSkill.findMany({ where: { userId: user.id, skillId: { in: selected } }, select: { id: true } })).map((item) => item.id) } } });
    for (const skillId of selected) {
      await tx.userSkill.upsert({ where: { userId_skillId: { userId: user.id, skillId } }, update: {}, create: { userId: user.id, skillId, evidenceLevel: "SELF_DECLARED" } });
    }
    await tx.activity.create({ data: { actorId: user.id, type: "SELF_DECLARED_SKILLS_UPDATED", metadata: { skillIds: selected } } });
  });
  revalidatePath("/dashboard/skills");
  revalidatePath("/members");
}
