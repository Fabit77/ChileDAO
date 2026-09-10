import { DashboardShell } from "@/components/dashboard-shell";
import { requireUser } from "@/lib/auth/session";
import { updateProfile } from "@/app/join/actions";

export default async function DashboardProfile({ searchParams }: { searchParams: Promise<{ error?: string; saved?: string }> }) {
  const user = await requireUser();
  const { error, saved } = await searchParams;

  return <DashboardShell active="Mi perfil" user={user}><form action={updateProfile}><div className="dashboard-head"><div><span className="eyebrow">Información pública</span><h1>Mi perfil</h1><p>Controla cómo apareces en el directorio de talento.</p></div><button className="button button-primary" type="submit">Guardar cambios</button></div>{saved && <p className="form-success">Perfil actualizado correctamente.</p>}{error && <p className="form-error">{error === "username-taken" ? "Ese username ya está en uso. Prueba con otro." : "Revisa los datos ingresados."}</p>}<div className="profile-edit form-grid"><label>Nombre visible<input name="displayName" required minLength={2} maxLength={80} defaultValue={user.profile?.displayName ?? ""} /></label><label>Username<div className="input-prefix"><span>@</span><input name="username" required minLength={2} maxLength={30} pattern="[A-Za-z0-9_-]{2,30}" defaultValue={user.profile?.username ?? ""} /></div><small>Tu username público. Puedes escribir Fabit; se guardará como fabit.</small></label><label className="full">Headline<input name="headline" maxLength={120} defaultValue={user.profile?.headline ?? ""} /></label><label className="full">Bio<textarea name="bio" maxLength={500} defaultValue={user.profile?.bio ?? ""} /></label><label>Ubicación<input name="location" maxLength={80} defaultValue={user.profile?.location ?? "Chile"} /></label></div></form></DashboardShell>;
}
