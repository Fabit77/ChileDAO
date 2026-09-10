import "server-only";
import { ContributionStatus, ValidationDecision } from "@prisma/client";
import { db } from "@/lib/db";
import { deriveContributionStatus } from "@/lib/domain/reputation";

export async function persistContribution(authorId: string, input: { title: string; description: string; role: string; startDate: Date; evidenceUrl: string }) {
  return db.contribution.create({ data: { authorId, title: input.title, description: input.description, role: input.role, startDate: input.startDate, status: ContributionStatus.SELF_CLAIMED, evidence: { create: { type: "URL", url: input.evidenceUrl } } }, select: { id: true, status: true } });
}

export async function persistValidationRequest(senderId: string, contributionId: string, recipientId: string) {
  const [contribution, recipient, existing] = await Promise.all([
    db.contribution.findFirst({ where: { id: contributionId, authorId: senderId }, select: { id: true } }),
    db.user.findFirst({ where: { id: recipientId, deactivatedAt: null, role: { in: ["MEMBER", "TRUSTED_MEMBER", "ADMIN", "SUPER_ADMIN"] } }, select: { id: true } }),
    db.validationRequest.findFirst({ where: { contributionId, recipientId, type: "CONTRIBUTION_VALIDATION", status: "PENDING", expiresAt: { gt: new Date() } }, select: { id: true } }),
  ]);
  if (!contribution || !recipient || senderId === recipientId) throw new Error("FORBIDDEN");
  if (existing) throw new Error("DUPLICATE_REQUEST");
  return db.validationRequest.create({ data: { type: "CONTRIBUTION_VALIDATION", tokenHash: crypto.randomUUID(), senderId, recipientId, contributionId, expiresAt: new Date(Date.now() + 14 * 86_400_000) }, select: { id: true } });
}

export async function persistContributionValidation(validatorId: string, input: { contributionId: string; decision: "VERIFIED" | "REJECTED" | "CHANGES_REQUESTED"; comment?: string }) {
  const [contribution, request] = await Promise.all([
    db.contribution.findUnique({ where: { id: input.contributionId }, select: { id: true, authorId: true } }),
    db.validationRequest.findFirst({ where: { contributionId: input.contributionId, recipientId: validatorId, type: "CONTRIBUTION_VALIDATION", status: "PENDING", expiresAt: { gt: new Date() } }, select: { id: true } }),
  ]);
  if (!contribution || contribution.authorId === validatorId || !request) throw new Error("FORBIDDEN");
  const previous = await db.contributionValidation.findFirst({ where: { contributionId: contribution.id, validatorId, organizationId: null } });
  if (previous) await db.contributionValidation.update({ where: { id: previous.id }, data: { decision: ValidationDecision[input.decision], comment: input.comment, respondedAt: new Date() } });
  else await db.contributionValidation.create({ data: { contributionId: contribution.id, validatorId, decision: ValidationDecision[input.decision], comment: input.comment, respondedAt: new Date() } });
  const records = await db.contributionValidation.findMany({ where: { contributionId: contribution.id }, select: { validatorId: true, organizationId: true, decision: true } });
  const status = deriveContributionStatus(records.map((record) => ({ validatorId: record.validatorId ?? undefined, organizationId: record.organizationId ?? undefined, decision: record.decision })));
  await db.$transaction([
    db.contribution.update({ where: { id: contribution.id }, data: { status: ContributionStatus[status] } }),
    db.validationRequest.updateMany({ where: { contributionId: contribution.id, recipientId: validatorId, type: "CONTRIBUTION_VALIDATION", status: "PENDING" }, data: { status: input.decision === "VERIFIED" ? "ACCEPTED" : "DECLINED", respondedAt: new Date() } }),
  ]);
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
    const normalized = address.toLowerCase();
    const existing = await tx.wallet.findUnique({ where: { address: normalized }, select: { id: true, userId: true } });
    if (existing && existing.userId !== userId) throw new Error("WALLET_ALREADY_CONNECTED");
    await tx.wallet.updateMany({ where: { userId }, data: { isPrimary: false } });
    return tx.wallet.upsert({ where: { address: normalized }, update: { isPrimary: true }, create: { userId, address: normalized, chainId: Number(process.env.EVM_CHAIN_ID ?? 8453), isPrimary: true, verifiedAt: null }, select: { id: true, address: true } });
  });
}
