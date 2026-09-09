import { Check, CircleDot, Link2, ShieldCheck } from "lucide-react";
import type { Contribution } from "@/lib/types";

const labels: Record<Contribution["status"], string> = {
  SELF_CLAIMED: "Declaración propia",
  COMMUNITY_VERIFIED: "Validada por miembros",
  ORGANIZATION_VERIFIED: "Validada por organización",
  ONCHAIN_VERIFIED: "Attestation onchain",
  DISPUTED: "En revisión",
};

export function ContributionStatus({ status }: { status: Contribution["status"] }) {
  const Icon = status === "ONCHAIN_VERIFIED" ? Link2 : status === "SELF_CLAIMED" ? CircleDot : status === "ORGANIZATION_VERIFIED" ? ShieldCheck : Check;
  return <span className={`status status-${status.toLowerCase()}`}><Icon size={13} />{labels[status]}</span>;
}

export function MemberVerified({ founding = false }: { founding?: boolean }) {
  return <span className="status status-member"><ShieldCheck size={13} />{founding ? "Miembro fundador" : "Miembro verificado"}</span>;
}
