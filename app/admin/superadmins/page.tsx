import type { Metadata } from "next";
import { ShieldCheck, ShieldMinus, UserPlus } from "lucide-react";
import { ConfirmActionForm } from "@/components/confirm-action-form";
import { requireSuperAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { promoteSuperAdmin, removeSuperAdmin } from "../actions";

export const metadata: Metadata = { title: "Superadmins" };

export default async function SuperAdminsPage() {
  const viewer = await requireSuperAdmin();
  const users = await db.user.findMany({ where: { deactivatedAt: null, profile: { isNot: null } }, include: { profile: true }, orderBy: { profile: { displayName: "asc" } } });
  const superadmins = users.filter((user) => user.role === "SUPER_ADMIN");
  const eligible = users.filter((user) => user.role !== "SUPER_ADMIN");

  return <div className="admin-grid admin-section"><section className="admin-panel"><div><span><span className="eyebrow">Acceso total</span><h2>Superadmins actuales</h2></span><ShieldCheck size={18} /></div><p className="admin-explainer">Pueden verificar perfiles, gestionar badges, desactivar cuentas y nombrar a otros superadmins.</p>{superadmins.map((user) => <article key={user.id}><span className="avatar avatar-small avatar-tone-1">{user.profile?.displayName.slice(0, 2).toUpperCase()}</span><span><b>{user.profile?.displayName}</b><small>@{user.profile?.username}{user.id === viewer.id ? " · Tu cuenta" : ""}</small></span>{user.id !== viewer.id && <ConfirmActionForm action={removeSuperAdmin} message={`¿Quitar el acceso de superadmin a @${user.profile?.username}? Continuará como MEMBER.`}><input type="hidden" name="userId" value={user.id} /><button className="admin-action danger" type="submit"><ShieldMinus size={14} /> Quitar acceso</button></ConfirmActionForm>}</article>)}</section><section className="admin-panel"><div><span><span className="eyebrow">Usuarios registrados</span><h2>Agregar superadmin</h2></span><UserPlus size={18} /></div><p className="admin-explainer">Solo puedes seleccionar cuentas que ya iniciaron sesión y completaron su perfil.</p>{eligible.length ? eligible.map((user) => <article key={user.id}><span className="avatar avatar-small avatar-tone-1">{user.profile?.displayName.slice(0, 2).toUpperCase()}</span><span><b>{user.profile?.displayName}</b><small>@{user.profile?.username} · {user.role}</small></span><ConfirmActionForm action={promoteSuperAdmin} message={`¿Dar acceso total de superadmin a @${user.profile?.username}?`}><input type="hidden" name="userId" value={user.id} /><button className="admin-action verify" type="submit"><UserPlus size={14} /> Hacer superadmin</button></ConfirmActionForm></article>) : <div className="empty-panel">No hay otros usuarios registrados disponibles.</div>}</section></div>;
}
