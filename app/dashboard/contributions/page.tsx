import { DashboardShell } from "@/components/dashboard-shell";
import { ContributionStatus } from "@/components/status-pill";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { ContributionManager } from "./contribution-manager";

export default async function ContributionsDashboard() {
  const user = await requireUser();
  const own = await db.contribution.findMany({ where: { authorId: user.id }, include: { project: true, validations: { where: { decision: "VERIFIED" } } }, orderBy: { createdAt: "desc" } });
  return <DashboardShell active="Contributions" user={user}><div className="dashboard-head"><div><span className="eyebrow">Proof of work</span><h1>Contributions</h1><p>Registra lo que hiciste, adjunta evidencia y solicita validación.</p></div><ContributionManager /></div>{own.length ? <div className="manage-list">{own.map((item) => <article className="manage-contribution" key={item.id}><div><ContributionStatus status={item.status} /><h3>{item.title}</h3><p>{item.role} · {item.project?.name ?? "Independiente"}</p></div><span>{item.validations.length} validaciones</span></article>)}</div> : <div className="empty-panel">Todavía no has registrado trabajo.</div>}</DashboardShell>;
}
