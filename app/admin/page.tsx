import type { Metadata } from "next";
import { Activity, AlertTriangle, Award, ShieldCheck, Users } from "lucide-react";
import { db } from "@/lib/db";

export const metadata: Metadata = { title: "Administración" };

const activityLabels: Record<string, string> = {
  ACCOUNT_DEACTIVATED: "Cuenta desactivada",
  ACCOUNT_REACTIVATED: "Cuenta reactivada",
  BADGE_AWARDED: "Badge entregado",
  BADGE_CREATED: "Badge creado",
  BADGE_REVOKED: "Badge retirado",
  FOUNDING_MEMBER_VERIFIED: "Perfil incorporado como fundador",
  SUPER_ADMIN_GRANTED: "Superadmin designado",
  SUPER_ADMIN_REMOVED: "Permiso de superadmin retirado",
};

export default async function AdminPage() {
  const [activeUsers, memberCount, badgeCount, disputedCount, recentActivity] = await Promise.all([
    db.user.count({ where: { deactivatedAt: null, profile: { isNot: null } } }),
    db.user.count({ where: { deactivatedAt: null, role: { in: ["MEMBER", "TRUSTED_MEMBER", "ADMIN", "SUPER_ADMIN"] } } }),
    db.badge.count(),
    db.contribution.count({ where: { status: "DISPUTED" } }),
    db.activity.findMany({ where: { type: { in: Object.keys(activityLabels) } }, include: { actor: { include: { profile: true } } }, orderBy: { createdAt: "desc" }, take: 8 }),
  ]);

  return <><div className="admin-metrics"><article><Users /><b>{activeUsers}</b><span>Usuarios activos</span></article><article><ShieldCheck /><b>{memberCount}</b><span>Miembros verificados</span></article><article><Award /><b>{badgeCount}</b><span>Badges disponibles</span></article><article><AlertTriangle /><b>{disputedCount}</b><span>Contributions en disputa</span></article></div><section className="admin-panel full"><div><span className="eyebrow">Actividad administrativa reciente</span><Activity size={17} /></div>{recentActivity.length ? recentActivity.map((item) => <article key={item.id}><span className="admin-event-icon"><Activity size={14} /></span><span><b>{activityLabels[item.type] ?? item.type}</b><small>por {item.actor?.profile?.displayName ?? "Sistema"} · {new Intl.DateTimeFormat("es-CL", { dateStyle: "medium", timeStyle: "short" }).format(item.createdAt)}</small></span></article>) : <div className="empty-panel">Todavía no hay acciones administrativas registradas.</div>}</section></>;
}
