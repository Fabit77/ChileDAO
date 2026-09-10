import Link from "next/link";
import { Award, Settings } from "lucide-react";
import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { db } from "@/lib/db";

export default async function DashboardBadgesPage() {
  const user = await requireUser();
  const badges = await db.userBadge.findMany({ where: { userId: user.id }, include: { badge: true }, orderBy: { awardedAt: "desc" } });

  return <DashboardShell active="Badges" user={user}><div className="dashboard-head"><div><span className="eyebrow">Reconocimientos</span><h1>Mis badges</h1><p>Logros entregados por administradores de Chile DAO.</p></div>{user.role === "SUPER_ADMIN" && <Link className="button button-primary" href="/admin/badges"><Settings size={16} /> Gestionar badges</Link>}</div>{badges.length ? <div className="dashboard-badge-grid">{badges.map((item) => <article key={item.id}><span className="badge-icon large">{item.badge.icon}</span><div><h2>{item.badge.name}</h2><p>{item.badge.description}</p><small>Entregado el {new Intl.DateTimeFormat("es-CL", { dateStyle: "long" }).format(item.awardedAt)}</small></div></article>)}</div> : <div className="empty-state"><Award size={34} /><h2>Todavía no tienes badges</h2><p>Los badges reconocen logros observables. No reemplazan skills, contributions ni vouches.</p></div>}</DashboardShell>;
}
