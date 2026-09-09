import type { AttestationInput, AttestationProvider, AttestationRecord } from "./provider";

/** Production adapter boundary for EAS or a compatible EVM contract.
 * Personal data must be hashed offchain before it reaches this class.
 */
export class EvmAttestationProvider implements AttestationProvider {
  private notConfigured(): never {
    throw new Error("EVM attestation provider is not configured. Use ATTESTATION_PROVIDER=mock locally.");
  }
  attestMembership(input: AttestationInput): Promise<AttestationRecord> {
    void input;
    return this.notConfigured();
  }
  attestContribution(input: AttestationInput): Promise<AttestationRecord> {
    void input;
    return this.notConfigured();
  }
  attestOrganizationVerification(input: AttestationInput): Promise<AttestationRecord> {
    void input;
    return this.notConfigured();
  }
  getAttestation(uid: string): Promise<AttestationRecord | null> {
    void uid;
    return this.notConfigured();
  }
}
