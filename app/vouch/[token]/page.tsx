import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Avatar } from "@/components/avatar";
import { Check, Info } from "lucide-react";
import { db } from "@/lib/db";
import { VouchPanel } from "./vouch-panel";

export const metadata: Metadata = { title: "Validar identidad comunitaria" };
export default async function VouchPage({ params }: { params: Promise<{ token: string }> }) {
  const candidateId = (await params).token;
  const candidate = await db.user.findFirst({ where: { id: candidateId, deactivatedAt: null, role: { in: ["CANDIDATE", "QUALIFIED"] } }, include: { profile: true, vouchesReceived: { where: { isActive: true }, select: { id: true } } } });
  if (!candidate?.profile) notFound();
  const initials = candidate.profile.displayName.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <main className="vouch-page"><div className="vouch-card"><section className="vouch-candidate"><span className="eyebrow">Membership vouch</span><Avatar initials={initials} size="hero" index={4} /><h1>¿Conoces a<br />{candidate.profile.displayName}?</h1><p>{candidate.profile.headline ?? candidate.profile.bio ?? "Miembro del ecosistema Web3."}</p><span className="member-location">{candidate.profile.location ?? "Chile"} · @{candidate.profile.username}</span><div className="mutuals"><span>{candidate.vouchesReceived.length} personas ya confirman conocerle</span></div></section><section className="vouch-explanation"><div className="meaning-box"><Info size={18} /><div><h2>¿Qué estás confirmando?</h2><p>Únicamente que conoces a esta persona y reconoces su vínculo con el ecosistema Web3.</p></div></div><ul><li><Check size={15} /> Es una persona real que conozco</li><li><Check size={15} /> Tiene vínculo con el ecosistema</li><li className="not"><span>×</span> No es una recomendación laboral</li><li className="not"><span>×</span> No valida sus skills profesionales</li></ul><VouchPanel candidateId={candidate.id} candidate={candidate.profile.displayName} /></section></div></main>;
}
