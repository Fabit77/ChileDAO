import Link from "next/link";
import { Logo } from "./logo";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div><Logo /><p>Confianza comunitaria. Trabajo demostrado.<br />Reputación verificable.</p></div>
        <div><span className="footer-label">Explorar</span><Link href="/members">Personas</Link><Link href="/projects">Proyectos</Link><Link href="/organizations">Organizaciones</Link></div>
        <div><span className="footer-label">Participar</span><Link href="/join">Crear perfil</Link><Link href="/dashboard">Mi dashboard</Link><Link href="/admin">Administración</Link></div>
        <div className="footer-note"><span>Construido desde Chile</span><span>para una Web abierta.</span></div>
      </div>
      <div className="container footer-bottom"><span>© 2026 Chile DAO</span><span><Link href="/privacy">Privacidad</Link> · <Link href="/terms">Reglas de la comunidad</Link> · Onchain cuando importa</span></div>
    </footer>
  );
}
