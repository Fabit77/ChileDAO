import { ShieldX } from "lucide-react";
import { signOut } from "@/app/auth/actions";

export default function AccountDisabledPage() {
  return <main className="login-page"><section className="login-card"><span className="join-icon"><ShieldX /></span><span className="eyebrow">Cuenta desactivada</span><h1>Tu acceso está pausado.</h1><p>Un superadmin desactivó esta cuenta. Tu historial se conserva y un superadmin puede reactivarla.</p><form action={signOut}><button className="auth-button" type="submit">Cerrar sesión</button></form></section></main>;
}
