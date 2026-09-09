export const VOUCH_THRESHOLD = 5;

export type MembershipRole =
  | "CANDIDATE"
  | "QUALIFIED"
  | "MEMBER"
  | "TRUSTED_MEMBER"
  | "ADMIN";

export type DomainVouch = {
  candidateId: string;
  validatorId: string;
  validatorRole: MembershipRole;
  active: boolean;
};

export type CandidateState = {
  id: string;
  role: MembershipRole;
  vouches: DomainVouch[];
};

export class DomainError extends Error {
  constructor(public readonly code: string, message: string) {
    super(message);
    this.name = "DomainError";
  }
}

export function canVouch(role: MembershipRole) {
  return role === "MEMBER" || role === "TRUSTED_MEMBER" || role === "ADMIN";
}

export function activeVouchCount(candidate: CandidateState) {
  return new Set(
    candidate.vouches.filter((vouch) => vouch.active).map((vouch) => vouch.validatorId),
  ).size;
}

export function createMembershipVouch(
  candidate: CandidateState,
  validator: { id: string; role: MembershipRole },
): CandidateState {
  if (candidate.id === validator.id) {
    throw new DomainError("SELF_VOUCH", "No puedes validar tu propio perfil.");
  }
  if (!canVouch(validator.role)) {
    throw new DomainError("INELIGIBLE_VALIDATOR", "Solo miembros verificados pueden validar.");
  }
  if (candidate.role !== "CANDIDATE" && candidate.role !== "QUALIFIED") {
    throw new DomainError("INVALID_CANDIDATE", "Esta persona ya no está reuniendo vouches.");
  }
  if (candidate.vouches.some((vouch) => vouch.validatorId === validator.id && vouch.active)) {
    throw new DomainError("DUPLICATE_VOUCH", "Ya validaste a esta persona.");
  }

  const vouches = [
    ...candidate.vouches.filter((vouch) => vouch.validatorId !== validator.id),
    {
      candidateId: candidate.id,
      validatorId: validator.id,
      validatorRole: validator.role,
      active: true,
    },
  ];

  return {
    ...candidate,
    vouches,
    role: activeVouchCount({ ...candidate, vouches }) >= VOUCH_THRESHOLD ? "MEMBER" : "CANDIDATE",
  };
}

export function revokeMembershipVouch(
  candidate: CandidateState,
  validatorId: string,
): CandidateState {
  const vouches = candidate.vouches.map((vouch) =>
    vouch.validatorId === validatorId ? { ...vouch, active: false } : vouch,
  );

  return {
    ...candidate,
    vouches,
    role:
      candidate.role === "CANDIDATE" || candidate.role === "QUALIFIED"
        ? activeVouchCount({ ...candidate, vouches }) >= VOUCH_THRESHOLD
          ? "MEMBER"
          : "CANDIDATE"
        : candidate.role,
  };
}
