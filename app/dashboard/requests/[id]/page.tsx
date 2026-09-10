import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ReviewForm } from "./review-form";

export default async function ReviewRequestPage({ params }: { params: Promise<{ id: string }> }) {
  const user = await requireUser();
  const request = await db.validationRequest.findFirst({ where: { id: (await params).id, recipientId: user.id, type: "CONTRIBUTION_VALIDATION", status: "PENDING", expiresAt: { gt: new Date() } }, include: { sender: { include: { profile: true } }, contribution: { include: { evidence: true } } } });
  if (!request?.contribution) notFound();
  return <DashboardShell active="Solicitudes" user={user}><Link className="back-link" href="/dashboard/requests"><ArrowLeft size={14} /> Volver a solicitudes</Link><div className="dashboard-head"><div><span className="eyebrow">Validación profesional</span><h1>{request.contribution.title}</h1><p>Solicitud de {request.sender.profile?.displayName ?? "un miembro"}. Esto no es un vouch de membresía.</p></div></div><div className="review-grid"><section className="admin-panel"><h2>Trabajo declarado</h2><p>{request.contribution.description}</p><dl><div><dt>Rol</dt><dd>{request.contribution.role}</dd></div><div><dt>Estado</dt><dd>{request.contribution.status}</dd></div></dl>{request.contribution.evidence.map((item) => <a className="arrow-link" href={item.url} target="_blank" rel="noreferrer" key={item.id}>Ver evidencia <ExternalLink size={14} /></a>)}</section><section className="admin-panel"><h2>Tu respuesta</h2><p className="admin-explainer">Valida solamente el trabajo descrito y su evidencia. Esta acción no afecta la membresía.</p><ReviewForm contributionId={request.contribution.id} /></section></div></DashboardShell>;
}
