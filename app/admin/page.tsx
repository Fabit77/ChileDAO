import type { Metadata } from "next";
import { AlertTriangle, Building2, ShieldCheck, Users } from "lucide-react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/session";
import { assignPlatformRole } from "./actions";

export const metadata: Metadata = { title: "Administración" };

export default async function AdminPage() {
  const viewer = await requireAdmin();
  const [users, organizationCount, disputedCount] = await Promise.all([
    db.user.findMany({ include: { profile: true, vouchesReceived: { where: { isActive: true }, select: { id: true } } }, orderBy: { createdAt: "desc" } }),
    db.organization.count(),
    db.contribution.count({ where: { status: "DISPUTED" } }),
  ]);
  const members = users.filter((user) => ["MEMBER", "TRUSTED_MEMBER", "ADMIN", "SUPER_ADMIN"].includes(user.role));
  const candidates = users.filter((user) => user.role === "CANDIDATE" || user.role === "QUALIFIED");
  return <main className="admin-page container"><div className="admin-head"><div><span className="eyebrow">Zona protegida · {viewer.role}</span><h1>Operaciones de confianza</h1><p>Roles, bootstrap y moderación con historial auditable.</p></div><span className="status status-member"><ShieldCheck size={13} /> Acceso administrativo</span></div><div className="admin-metrics"><article><Users /><b>{members.length}</b><span>Miembros</span></article><article><Users /><b>{candidates.length}</b><span>Candidates</span></article><article><Building2 /><b>{organizationCount}</b><span>Organizaciones</span></article><article><AlertTriangle /><b>{disputedCount}</b><span>En disputa</span></article></div><div className="admin-grid"><section className="admin-panel full"><div><span className="eyebrow">Usuarios reales</span></div>{users.length === 0 ? <div className="empty-panel">Todavía no hay perfiles registrados.</div> : users.map((user) => <article key={user.id}><span className="avatar avatar-small avatar-tone-1">{(user.profile?.displayName ?? user.email).slice(0, 2).toUpperCase()}</span><span><b>{user.profile?.displayName ?? "Perfil pendiente"}</b><small>@{user.profile?.username ?? user.githubUsername ?? "sin-username"} · {user.role} · {user.vouchesReceived.length}/5 vouches</small></span>{viewer.role === "SUPER_ADMIN" && user.profile && <form action={assignPlatformRole}><input type="hidden" name="username" value={user.profile.username} /><select name="role" defaultValue={user.role === "CANDIDATE" || user.role === "QUALIFIED" || user.role === "TRUSTED_MEMBER" ? "MEMBER" : user.role}><option value="MEMBER">Member fundador</option><option value="ADMIN">Admin</option><option value="SUPER_ADMIN">Superadmin</option></select><button type="submit">Asignar</button></form>}</article>)}</section></div></main>;
}
