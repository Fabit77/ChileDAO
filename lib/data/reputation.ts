import "server-only";
import { ContributionStatus, ValidationDecision } from "@prisma/client";
import { db } from "@/lib/db";
import { deriveContributionStatus } from "@/lib/domain/reputation";

export async function persistContribution(authorId: string, input: { title: string; description: string; role: string; startDate: Date; evidenceUrl: string }) {
  return db.contribution.create({ data: { authorId, title: input.title, description: input.description, role: input.role, startDate: input.startDate, status: ContributionStatus.SELF_CLAIMED, evidence: { create: { type: "URL", url: input.evidenceUrl } } }, select: { id: true, status: true } });
}

export async function persistValidationRequest(senderId: string, contributionId: string, recipientId: string) {
  const contribution = await db.contribution.findFirst({ where: { id: contributionId, authorId: senderId }, select: { id: true } });
  if (!contribution) throw new Error("FORBIDDEN");
  return db.validationRequest.create({ data: { type: "CONTRIBUTION_VALIDATION", tokenHash: crypto.randomUUID(), senderId, recipientId, contributionId, expiresAt: new Date(Date.now() + 14 * 86_400_000) }, select: { id: true } });
}

export async function persistContributionValidation(validatorId: string, input: { contributionId: string; decision: "VERIFIED" | "REJECTED" | "CHANGES_REQUESTED"; comment?: string }) {
  const contribution = await db.contribution.findUnique({ where: { id: input.contributionId }, select: { id: true, authorId: true } });
  if (!contribution || contribution.authorId === validatorId) throw new Error("FORBIDDEN");
  const previous = await db.contributionValidation.findFirst({ where: { contributionId: contribution.id, validatorId, organizationId: null } });
  if (previous) await db.contributionValidation.update({ where: { id: previous.id }, data: { decision: ValidationDecision[input.decision], comment: input.comment, respondedAt: new Date() } });
  else await db.contributionValidation.create({ data: { contributionId: contribution.id, validatorId, decision: ValidationDecision[input.decision], comment: input.comment, respondedAt: new Date() } });
  const records = await db.contributionValidation.findMany({ where: { contributionId: contribution.id }, select: { validatorId: true, organizationId: true, decision: true } });
  const status = deriveContributionStatus(records.map((record) => ({ validatorId: record.validatorId ?? undefined, organizationId: record.organizationId ?? undefined, decision: record.decision })));
  await db.contribution.update({ where: { id: contribution.id }, data: { status: ContributionStatus[status] } });
  return { status };
}

export async function persistEndorsement(validatorId: string, input: { recipientId: string; skillId: string; contributionId?: string; comment?: string }) {
  if (input.recipientId === validatorId) throw new Error("FORBIDDEN");
  if (input.contributionId) {
    const work = await db.contribution.findFirst({ where: { id: input.contributionId, authorId: input.recipientId }, select: { id: true } });
    if (!work) throw new Error("INVALID_CONTEXT");
  }
  const duplicate = await db.skillEndorsement.findFirst({ where: { validatorId, recipientId: input.recipientId, skillId: input.skillId, contributionId: input.contributionId ?? null } });
  if (duplicate) throw new Error("DUPLICATE_ENDORSEMENT");
  return db.skillEndorsement.create({ data: { validatorId, ...input }, select: { id: true } });
}

export async function persistWallet(userId: string, address: string) {
  return db.$transaction(async (tx) => {
    await tx.wallet.updateMany({ where: { userId }, data: { isPrimary: false } });
    return tx.wallet.upsert({ where: { address: address.toLowerCase() }, update: { userId, isPrimary: true, verifiedAt: new Date() }, create: { userId, address: address.toLowerCase(), chainId: Number(process.env.EVM_CHAIN_ID ?? 8453), isPrimary: true, verifiedAt: new Date() }, select: { id: true, address: true } });
  });
}
