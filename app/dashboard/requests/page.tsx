import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function RequestsPage() {
  const user = await requireUser();
  const requests = await db.validationRequest.findMany({ where: { recipientId: user.id, status: "PENDING", expiresAt: { gt: new Date() } }, include: { sender: { include: { profile: true } }, contribution: true }, orderBy: { createdAt: "desc" } });
  return <DashboardShell active="Solicitudes" user={user}><div className="dashboard-head"><div><span className="eyebrow">Validaciones</span><h1>Solicitudes</h1><p>Revisa cada señal en su contexto antes de responder.</p></div></div>{requests.length ? <div className="request-list large">{requests.map((request) => <article key={request.id}><span className={`request-type ${request.type === "MEMBERSHIP_VOUCH" ? "trust" : "work"}`}>{request.type === "MEMBERSHIP_VOUCH" ? "Identidad" : "Trabajo"}</span><div><b>{request.sender.profile?.displayName ?? "Un miembro"} solicita una validación</b><p>{request.type === "MEMBERSHIP_VOUCH" ? "Confirma únicamente que le conoces y reconoces su vínculo con Web3." : request.contribution?.title}</p></div><Link href={request.type === "MEMBERSHIP_VOUCH" ? `/vouch/${request.senderId}` : `/dashboard/requests/${request.id}`}>Revisar <ArrowRight size={14} /></Link></article>)}</div> : <div className="empty-panel">No tienes solicitudes pendientes.</div>}</DashboardShell>;
}
