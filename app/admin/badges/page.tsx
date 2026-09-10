import type { Metadata } from "next";
import { Award, Plus, X } from "lucide-react";
import { requireSuperAdmin } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { awardBadge, createBadge, revokeBadge } from "../actions";

export const metadata: Metadata = { title: "Badges" };

export default async function AdminBadgesPage() {
  await requireSuperAdmin();
  const [badges, users] = await Promise.all([
    db.badge.findMany({ orderBy: { name: "asc" } }),
    db.user.findMany({
      where: { deactivatedAt: null, profile: { isNot: null }, role: { in: ["MEMBER", "TRUSTED_MEMBER", "ADMIN", "SUPER_ADMIN"] } },
      include: { profile: true, badges: { include: { badge: true }, orderBy: { awardedAt: "asc" } } },
      orderBy: { profile: { displayName: "asc" } },
    }),
  ]);

  return <div className="admin-grid admin-section"><section className="admin-panel"><div><span><span className="eyebrow">Catálogo</span><h2>Crear badge manual</h2></span><Award size={18} /></div><p className="admin-explainer">Los badges son reconocimientos. No validan skills y no cuentan para los 5 vouches.</p><form action={createBadge} className="admin-create-form"><label>Nombre<input name="name" required minLength={2} maxLength={60} placeholder="Ej. Mentor Web3" /></label><label>Descripción<textarea name="description" required minLength={5} maxLength={240} placeholder="Explica qué reconoce este badge." /></label><label>Icono<input name="icon" required maxLength={12} defaultValue="🏅" /></label><button className="button button-dark" type="submit"><Plus size={15} /> Crear badge</button></form></section><section className="admin-panel"><div><span><span className="eyebrow">Disponibles</span><h2>{badges.length} badges</h2></span></div><div className="badge-catalog">{badges.map((badge) => <article key={badge.id}><span className="badge-icon">{badge.icon}</span><span><b>{badge.name}</b><small>{badge.description}</small></span></article>)}</div></section><section className="admin-panel full"><div><span><span className="eyebrow">Asignación manual</span><h2>Badges de miembros</h2></span></div>{users.length === 0 ? <div className="empty-panel">Primero debe existir al menos un miembro verificado.</div> : users.map((user) => {
    const available = badges.filter((badge) => !user.badges.some((item) => item.badgeId === badge.id));
    return <article className="badge-user-row" key={user.id}><span className="avatar avatar-small avatar-tone-1">{user.profile?.displayName.slice(0, 2).toUpperCase()}</span><span><b>{user.profile?.displayName}</b><small>@{user.profile?.username} · {user.role}</small><span className="awarded-badges">{user.badges.map((item) => <span className="awarded-badge" key={item.id}>{item.badge.icon} {item.badge.name}<form action={revokeBadge}><input type="hidden" name="userId" value={user.id} /><input type="hidden" name="badgeId" value={item.badgeId} /><button aria-label={`Quitar ${item.badge.name}`} title={`Quitar ${item.badge.name}`} type="submit"><X size={11} /></button></form></span>)}</span></span>{available.length ? <form action={awardBadge} className="badge-award-form"><input type="hidden" name="userId" value={user.id} /><select name="badgeId" required defaultValue=""><option value="" disabled>Elegir badge</option>{available.map((badge) => <option key={badge.id} value={badge.id}>{badge.icon} {badge.name}</option>)}</select><button className="admin-action verify" type="submit"><Award size={14} /> Entregar</button></form> : <small>Todos asignados</small>}</article>;
  })}</section></div>;
}
