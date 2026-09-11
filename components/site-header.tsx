import Link from "next/link";
import { Menu } from "lucide-react";
import { Suspense } from "react";
import { Logo } from "./logo";
import { getSessionUser } from "@/lib/auth/session";
import { signOut } from "@/app/auth/actions";

function PublicActions() {
  return <><Link className="text-link hide-mobile" href="/auth/login">Ingresar</Link><Link className="button button-dark button-small" href="/join">Crear perfil</Link></>;
}

async function SessionActions() {
  const user = await getSessionUser();
  return user ? <><Link className="text-link hide-mobile" href="/dashboard">{user.profile ? `@${user.profile.username}` : "Completar perfil"}</Link><form action={signOut}><button className="button button-dark button-small" type="submit">Salir</button></form></> : <PublicActions />;
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="container nav-inner">
        <Logo />
        <nav className="desktop-nav" aria-label="Navegación principal">
          <Link href="/members">Personas</Link>
          <Link href="/projects">Proyectos</Link>
          <Link href="/organizations">Organizaciones</Link>
        </nav>
        <div className="nav-actions">
          <Suspense fallback={<PublicActions />}><SessionActions /></Suspense>
          <details className="mobile-menu">
            <summary aria-label="Abrir menú"><Menu size={20} /></summary>
            <nav>
              <Link href="/members">Personas</Link>
              <Link href="/projects">Proyectos</Link>
              <Link href="/organizations">Organizaciones</Link>
              <Link href="/dashboard">Mi dashboard</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
