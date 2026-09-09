import type {
  AttestationInput,
  AttestationKind,
  AttestationProvider,
  AttestationRecord,
} from "./provider";

export class MockAttestationProvider implements AttestationProvider {
  private readonly records = new Map<string, AttestationRecord>();

  private async attest(type: AttestationKind, input: AttestationInput) {
    const uid = `mock:${type.toLowerCase()}:${input.entityId}`;
    const record: AttestationRecord = {
      ...input,
      type,
      chainId: 31337,
      attestationUid: uid,
      issuedAt: new Date().toISOString(),
    };
    this.records.set(uid, record);
    return record;
  }

  attestMembership(input: AttestationInput) {
    return this.attest("MEMBERSHIP", input);
  }

  attestContribution(input: AttestationInput) {
    return this.attest("CONTRIBUTION", input);
  }

  attestOrganizationVerification(input: AttestationInput) {
    return this.attest("ORGANIZATION_VERIFICATION", input);
  }

  async getAttestation(uid: string) {
    return this.records.get(uid) ?? null;
  }
}
