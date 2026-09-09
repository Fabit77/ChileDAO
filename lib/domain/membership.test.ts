import { describe, expect, it } from "vitest";
import {
  DomainError,
  createMembershipVouch,
  revokeMembershipVouch,
  type CandidateState,
} from "./membership";
import { addEndorsement, addMembershipVouch, deriveContributionStatus } from "./reputation";

function candidate(count = 0): CandidateState {
  return {
    id: "candidate",
    role: "CANDIDATE",
    vouches: Array.from({ length: count }, (_, index) => ({
      candidateId: "candidate",
      validatorId: `member-${index}`,
      validatorRole: "MEMBER",
      active: true,
    })),
  };
}

describe("membership trust graph", () => {
  it("keeps a candidate with four vouches as CANDIDATE", () => {
    expect(candidate(4).role).toBe("CANDIDATE");
  });

  it("turns the fifth valid vouch into membership", () => {
    expect(createMembershipVouch(candidate(4), { id: "member-5", role: "MEMBER" }).role).toBe(
      "MEMBER",
    );
  });

  it("rejects a duplicate active vouch", () => {
    expect(() => createMembershipVouch(candidate(1), { id: "member-0", role: "MEMBER" })).toThrow(
      DomainError,
    );
  });

  it("rejects self-vouching", () => {
    expect(() => createMembershipVouch(candidate(), { id: "candidate", role: "MEMBER" })).toThrow(
      "propio perfil",
    );
  });

  it("does not allow candidates to vouch", () => {
    expect(() => createMembershipVouch(candidate(), { id: "other", role: "CANDIDATE" })).toThrow(
      "miembros verificados",
    );
  });

  it("allows verified members to vouch", () => {
    expect(createMembershipVouch(candidate(), { id: "member", role: "MEMBER" }).vouches).toHaveLength(1);
  });

  it("allows a superadmin to bootstrap the trust graph", () => {
    expect(createMembershipVouch(candidate(), { id: "owner", role: "SUPER_ADMIN" }).vouches).toHaveLength(1);
  });

  it("decreases the count when a pre-membership vouch is revoked", () => {
    expect(revokeMembershipVouch(candidate(4), "member-0").vouches.filter((v) => v.active)).toHaveLength(3);
  });

  it("professional endorsements never count as membership vouches", () => {
    const start = { membershipVouches: 2, contributions: 1, verifiedContributions: 1, endorsements: 0, badges: 0 };
    expect(addEndorsement(start).membershipVouches).toBe(2);
  });

  it("membership vouches never create professional endorsements", () => {
    const start = { membershipVouches: 2, contributions: 1, verifiedContributions: 1, endorsements: 4, badges: 0 };
    expect(addMembershipVouch(start).endorsements).toBe(4);
  });

  it("keeps a self-claimed contribution unverified without validation records", () => {
    expect(deriveContributionStatus([])).toBe("SELF_CLAIMED");
  });
});
