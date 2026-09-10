import Link from "next/link";
import { ArrowRight, FileCheck2, Plus, ShieldCheck, Sparkles } from "lucide-react";
import { ContributionStatus } from "@/components/status-pill";
import { DashboardShell } from "@/components/dashboard-shell";
import { ProgressRing } from "@/components/progress-ring";
import { CopyVouchLink } from "@/components/copy-vouch-link";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function Dashboard() {
  const user = await requireUser();
  if (!user.profile) return <DashboardShell user={user}><div className="empty-state"><h2>Completa tu perfil</h2><p>Necesitas un perfil público antes de participar.</p><Link className="button button-primary" href="/join">Crear perfil</Link></div></DashboardShell>;
  const [vouches, contributions, verifiedContributions, endorsements, pendingRequests, recentWork] = await Promise.all([
    db.membershipVouch.count({ where: { candidateId: user.id, isActive: true } }),
    db.contribution.count({ where: { authorId: user.id } }),
    db.contribution.count({ where: { authorId: user.id, status: { in: ["COMMUNITY_VERIFIED", "ORGANIZATION_VERIFIED", "ONCHAIN_VERIFIED"] } } }),
    db.skillEndorsement.count({ where: { recipientId: user.id } }),
    db.validationRequest.count({ where: { recipientId: user.id, status: "PENDING" } }),
    db.contribution.findMany({ where: { authorId: user.id }, include: { project: true }, orderBy: { createdAt: "desc" }, take: 3 }),
  ]);
  const candidate = user.role === "CANDIDATE" || user.role === "QUALIFIED";
  if (candidate) return <DashboardShell candidate user={user} vouchCount={vouches}><div className="dashboard-head"><div><span className="eyebrow">Candidate dashboard</span><h1>Hola, {user.profile.displayName}.</h1><p>Tu lugar en la red comienza con personas que ya te conocen.</p></div><CopyVouchLink candidateId={user.id} /></div><section className="candidate-progress-card"><ProgressRing value={vouches} total={5} /><div><span className="eyebrow">Confianza comunitaria</span><h2>{vouches === 0 ? "Comienza a reunir vouches" : `Te faltan ${Math.max(0, 5 - vouches)} vouches`}</h2><p>Comparte tu enlace solamente con miembros que te conocen y reconocen tu vínculo con el ecosistema.</p></div><div className="candidate-steps"><span>Perfil creado</span><span>{vouches} personas te conocen</span><span>{Math.max(0, 5 - vouches)} vouches pendientes</span><span>Ingreso a Chile DAO</span></div></section></DashboardShell>;
  return <DashboardShell user={user} vouchCount={vouches}><div className="dashboard-head"><div><span className="eyebrow">Member dashboard</span><h1>Hola, {user.profile.displayName}.</h1><p>{pendingRequests ? `Tienes ${pendingRequests} solicitudes pendientes.` : "Tu actividad y reputación en un solo lugar."}</p></div><Link className="button button-primary" href="/dashboard/contributions"><Plus size={16} /> Nueva contribution</Link></div><div className="metric-grid"><article><ShieldCheck /><span>Community trust</span><b>{vouches}</b><small>vouches de membresía</small></article><article><FileCheck2 /><span>Trabajo demostrado</span><b>{verifiedContributions}</b><small>de {contributions} contributions</small></article><article><Sparkles /><span>Reputación profesional</span><b>{endorsements}</b><small>endorsements recibidos</small></article></div><section className="dash-section"><div className="dash-section-head"><div><span className="eyebrow">Tu actividad</span><h2>Contributions recientes</h2></div></div>{recentWork.length ? <div className="compact-work-list">{recentWork.map((item) => <Link key={item.id} href="/dashboard/contributions"><div><ContributionStatus status={item.status} /><b>{item.title}</b><span>{item.project?.name ?? "Independiente"}</span></div><ArrowRight size={17} /></Link>)}</div> : <div className="empty-panel">Todavía no has registrado contributions.</div>}</section></DashboardShell>;
}
