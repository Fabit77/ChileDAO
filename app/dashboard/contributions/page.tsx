import { DashboardShell } from "@/components/dashboard-shell";
import { ContributionStatus } from "@/components/status-pill";
import { contributions } from "@/lib/demo-data";
import { ContributionManager } from "./contribution-manager";
export default function ContributionsDashboard() { const own = contributions.filter((c) => c.authorSlug === "camila-soto"); return <DashboardShell active="Contributions"><div className="dashboard-head"><div><span className="eyebrow">Proof of work</span><h1>Contributions</h1><p>Registra lo que hiciste, adjunta evidencia y solicita validación.</p></div><ContributionManager /></div><div className="manage-list">{own.map((item) => <article className="manage-contribution" key={item.id}><div><ContributionStatus status={item.status} /><h3>{item.title}</h3><p>{item.role} · {item.project}</p></div><span>{item.validators} validaciones</span></article>)}</div></DashboardShell>; }
