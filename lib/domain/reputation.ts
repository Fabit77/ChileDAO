export type ContributionStatus =
  | "SELF_CLAIMED"
  | "COMMUNITY_VERIFIED"
  | "ORGANIZATION_VERIFIED"
  | "ONCHAIN_VERIFIED"
  | "DISPUTED";

export type ContributionValidation = {
  validatorId?: string;
  organizationId?: string;
  decision: "PENDING" | "VERIFIED" | "REJECTED" | "CHANGES_REQUESTED";
};

export function deriveContributionStatus(
  validations: ContributionValidation[],
  onchain = false,
): ContributionStatus {
  if (validations.some((validation) => validation.decision === "REJECTED")) return "DISPUTED";
  if (onchain) return "ONCHAIN_VERIFIED";
  if (
    validations.some(
      (validation) => validation.organizationId && validation.decision === "VERIFIED",
    )
  ) {
    return "ORGANIZATION_VERIFIED";
  }
  if (validations.some((validation) => validation.validatorId && validation.decision === "VERIFIED")) {
    return "COMMUNITY_VERIFIED";
  }
  return "SELF_CLAIMED";
}

export type TrustSignals = {
  membershipVouches: number;
  contributions: number;
  verifiedContributions: number;
  endorsements: number;
  badges: number;
};

export function addEndorsement(signals: TrustSignals): TrustSignals {
  return { ...signals, endorsements: signals.endorsements + 1 };
}

export function addMembershipVouch(signals: TrustSignals): TrustSignals {
  return { ...signals, membershipVouches: signals.membershipVouches + 1 };
}
