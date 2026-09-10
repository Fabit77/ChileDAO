import type { Metadata } from "next";
import { CheckCircle2, Power, RotateCcw } from "lucide-react";
import { ConfirmActionForm } from "@/components/confirm-action-form";
import { requireSuperAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { deactivateAccount, reactivateAccount, verifyProfile } from "../actions";

export const metadata: Metadata = { title: "Usuarios" };

export default async function AdminUsersPage() {
  const viewer = await requireSuperAdmin();
  const users = await db.user.findMany({ include: { profile: true, vouchesReceived: { where: { isActive: true }, select: { id: true } } }, orderBy: { createdAt: "desc" } });

  return <section className="admin-panel full admin-section"><div><span><span className="eyebrow">Usuarios registrados</span><h2>Perfiles y cuentas</h2></span><small>{users.length} cuentas</small></div><p className="admin-explainer">“Verificar” incorpora a un Candidate como miembro fundador. No crea vouches ni validaciones profesionales falsas. Desactivar oculta la cuenta y bloquea su acceso, pero conserva el historial para poder recuperarla.</p>{users.length === 0 ? <div className="empty-panel">Todavía no hay perfiles registrados.</div> : users.map((user) => <article key={user.id} className={user.deactivatedAt ? "is-disabled" : ""}><span className="avatar avatar-small avatar-tone-1">{(user.profile?.displayName ?? "?").slice(0, 2).toUpperCase()}</span><span><b>{user.profile?.displayName ?? "Perfil pendiente"}</b><small>@{user.profile?.username ?? user.githubUsername ?? "sin-username"} · {user.deactivatedAt ? "DESACTIVADA" : user.role} · {user.vouchesReceived.length}/5 vouches</small></span><div className="admin-row-actions">{!user.deactivatedAt && (user.role === "CANDIDATE" || user.role === "QUALIFIED") && user.profile && <ConfirmActionForm action={verifyProfile} message={`¿Incorporar a @${user.profile.username} como miembro fundador? Esta acción no creará vouches.`}><input type="hidden" name="userId" value={user.id} /><button className="admin-action verify" type="submit"><CheckCircle2 size={14} /> Verificar perfil</button></ConfirmActionForm>}{user.deactivatedAt ? <form action={reactivateAccount}><input type="hidden" name="userId" value={user.id} /><button className="admin-action" type="submit"><RotateCcw size={14} /> Reactivar</button></form> : user.id !== viewer.id && <ConfirmActionForm action={deactivateAccount} message={`¿Desactivar la cuenta de @${user.profile?.username ?? user.githubUsername ?? "este usuario"}? Perderá el acceso y dejará de aparecer públicamente.`}><input type="hidden" name="userId" value={user.id} /><button className="admin-action danger" type="submit"><Power size={14} /> Desactivar</button></ConfirmActionForm>}</div></article>)}</section>;
}
