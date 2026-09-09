import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { updateProfile } from "@/app/join/actions";

export default async function DashboardProfile() {
  const user = await requireUser();
  return <DashboardShell active="Mi perfil" user={user}><form action={updateProfile}><div className="dashboard-head"><div><span className="eyebrow">Información pública</span><h1>Mi perfil</h1><p>Controla cómo apareces en el directorio de talento.</p></div><button className="button button-primary" type="submit">Guardar cambios</button></div><div className="profile-edit form-grid"><label>Nombre visible<input name="displayName" required defaultValue={user.profile?.displayName ?? ""} /></label><label>Username<div className="input-prefix"><span>@</span><input value={user.profile?.username ?? ""} disabled /></div></label><label className="full">Headline<input name="headline" defaultValue={user.profile?.headline ?? ""} /></label><label className="full">Bio<textarea name="bio" defaultValue={user.profile?.bio ?? ""} /></label><label>Ubicación<input name="location" defaultValue={user.profile?.location ?? "Chile"} /></label></div></form></DashboardShell>;
}
