export type AttestationKind = "MEMBERSHIP" | "CONTRIBUTION" | "ORGANIZATION_VERIFICATION";

export type AttestationInput = {
  entityId: string;
  subjectWallet: `0x${string}`;
  attesterWallet: `0x${string}`;
  metadataHash: `0x${string}`;
};

export type AttestationRecord = AttestationInput & {
  type: AttestationKind;
  chainId: number;
  attestationUid: string;
  txHash?: string;
  schemaUid?: string;
  issuedAt: string;
};

export interface AttestationProvider {
  attestMembership(input: AttestationInput): Promise<AttestationRecord>;
  attestContribution(input: AttestationInput): Promise<AttestationRecord>;
  attestOrganizationVerification(input: AttestationInput): Promise<AttestationRecord>;
  getAttestation(uid: string): Promise<AttestationRecord | null>;
}
