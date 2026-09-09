import Link from "next/link";
import { Menu } from "lucide-react";
import { Logo } from "./logo";

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
          <Link className="text-link hide-mobile" href="/auth/demo">Ingresar</Link>
          <Link className="button button-dark button-small" href="/join">Crear perfil</Link>
          <details className="mobile-menu">
            <summary aria-label="Abrir menú"><Menu size={20} /></summary>
            <nav>
              <Link href="/members">Personas</Link>
              <Link href="/projects">Proyectos</Link>
              <Link href="/organizations">Organizaciones</Link>
              <Link href="/dashboard">Dashboard demo</Link>
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
