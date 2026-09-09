import "server-only";
import { MembershipRole, Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { canVouch, DomainError, VOUCH_THRESHOLD } from "@/lib/domain/membership";

type VouchInput = {
  candidateId: string;
  validatorId: string;
  relationship: "worked_together" | "event" | "community" | "hackathon" | "friend" | "education" | "other";
  isPublic: boolean;
};

const relationshipMap = {
  worked_together: "WORKED_TOGETHER",
  event: "EVENT",
  community: "COMMUNITY",
  hackathon: "HACKATHON",
  friend: "FRIEND",
  education: "EDUCATION",
  other: "OTHER",
} as const;

export async function persistMembershipVouch(input: VouchInput) {
  return db.$transaction(async (tx) => {
    const [candidate, validator] = await Promise.all([
      tx.user.findUnique({ where: { id: input.candidateId }, select: { id: true, role: true } }),
      tx.user.findUnique({ where: { id: input.validatorId }, select: { id: true, role: true } }),
    ]);
    if (!candidate || !validator) throw new DomainError("NOT_FOUND", "No encontramos ese perfil.");
    if (candidate.id === validator.id) throw new DomainError("SELF_VOUCH", "No puedes validar tu propio perfil.");
    if (!canVouch(validator.role)) throw new DomainError("INELIGIBLE_VALIDATOR", "Solo miembros verificados pueden validar.");
    if (candidate.role !== MembershipRole.CANDIDATE && candidate.role !== MembershipRole.QUALIFIED) throw new DomainError("INVALID_CANDIDATE", "Esta persona ya no está reuniendo vouches.");

    const previous = await tx.membershipVouch.findUnique({ where: { validatorId_candidateId: { validatorId: validator.id, candidateId: candidate.id } } });
    if (previous?.isActive) throw new DomainError("DUPLICATE_VOUCH", "Ya validaste a esta persona.");

    const vouch = await tx.membershipVouch.upsert({
      where: { validatorId_candidateId: { validatorId: validator.id, candidateId: candidate.id } },
      update: { isActive: true, revokedAt: null, createdAt: new Date(), validatorRole: validator.role, relationship: relationshipMap[input.relationship], isPublic: input.isPublic },
      create: { validatorId: validator.id, candidateId: candidate.id, validatorRole: validator.role, relationship: relationshipMap[input.relationship], isPublic: input.isPublic },
    });
    const count = await tx.membershipVouch.count({ where: { candidateId: candidate.id, isActive: true } });
    if (count >= VOUCH_THRESHOLD) await tx.user.update({ where: { id: candidate.id }, data: { role: MembershipRole.MEMBER, membershipSource: "VOUCHED", qualifiedAt: new Date(), memberSince: new Date() } });
    return { vouchId: vouch.id, activeCount: count, membershipCompleted: count >= VOUCH_THRESHOLD };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}

export async function persistVouchRevocation(vouchId: string, validatorId: string) {
  return db.$transaction(async (tx) => {
    const vouch = await tx.membershipVouch.findFirst({ where: { id: vouchId, validatorId, isActive: true }, include: { candidate: { select: { role: true } } } });
    if (!vouch) throw new DomainError("NOT_FOUND", "No encontramos un vouch activo que puedas revocar.");
    await tx.membershipVouch.update({ where: { id: vouch.id }, data: { isActive: false, revokedAt: new Date() } });
    const activeCount = await tx.membershipVouch.count({ where: { candidateId: vouch.candidateId, isActive: true } });
    if ((vouch.candidate.role === MembershipRole.CANDIDATE || vouch.candidate.role === MembershipRole.QUALIFIED) && activeCount < VOUCH_THRESHOLD) await tx.user.update({ where: { id: vouch.candidateId }, data: { role: MembershipRole.CANDIDATE, qualifiedAt: null } });
    return { activeCount };
  }, { isolationLevel: Prisma.TransactionIsolationLevel.Serializable });
}
