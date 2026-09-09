import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, FileCheck2, Network, ShieldCheck, Users } from "lucide-react";
import { ContributionCard } from "@/components/contribution-card";
import { MemberCard } from "@/components/member-card";
import { contributions, members, organizations } from "@/lib/demo-data";

const layers = [
  { n: "01", icon: Users, question: "¿Quién te conoce?", name: "Confianza comunitaria", body: "Cinco miembros distintos confirman que te conocen y que formas parte del ecosistema. Nada más, y nada menos." },
  { n: "02", icon: FileCheck2, question: "¿Qué has hecho?", name: "Trabajo demostrado", body: "Proyectos, contributions y evidencia pública muestran lo que realmente has construido." },
  { n: "03", icon: ShieldCheck, question: "¿Quién da fe de tu trabajo?", name: "Reputación profesional", body: "Miembros y organizaciones validan trabajo y skills concretas con contexto verificable." },
];

export default function Home() {
  return (
    <main>
      <section className="home-hero">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow"><span className="live-dot" /> Red de confianza · Web3 Chile</span>
            <h1>Tu reputación<br />empieza con<br /><em>tu trabajo.</em></h1>
            <p>Chile DAO conecta a quienes construyen el ecosistema Web3 chileno mediante confianza comunitaria, evidencia real y reputación verificable.</p>
            <div className="hero-actions"><Link className="button button-primary" href="/members">Explorar comunidad <ArrowRight size={17} /></Link><Link className="button button-secondary" href="/join">Crear mi perfil</Link></div>
            <div className="hero-proof"><div className="avatar-stack">{members.slice(0, 4).map((m, i) => <span key={m.id} className={`avatar-mini avatar-tone-${i}`}>{m.initials}</span>)}</div><span><b>+80 builders</b><br />conectando desde Chile</span></div>
          </div>
          <div className="trust-visual" aria-label="Ejemplo del grafo de confianza de Chile DAO">
            <div className="visual-grid" />
            <div className="orbit orbit-one" /><div className="orbit orbit-two" />
            <div className="trust-node node-main"><span className="node-avatar avatar-tone-1">CS</span><b>Camila Soto</b><small>Community Lead</small><span className="verified-line"><Check size={11} /> Member verified</span></div>
            {["IR", "TA", "AP", "BL", "NM"].map((initials, i) => <div key={initials} className={`trust-node node-small node-${i + 1}`}><span className={`node-avatar avatar-tone-${i}`}>{initials}</span><i /></div>)}
            <div className="visual-label label-trust"><Users size={14} /><span><b>8</b> community vouches</span></div>
            <div className="visual-label label-work"><FileCheck2 size={14} /><span><b>9</b> trabajos verificados</span></div>
            <div className="visual-caption"><Network size={15} /> Una red construida por relaciones reales</div>
          </div>
        </div>
      </section>

      <section className="signal-strip"><div className="container">{["Confianza comunitaria", "Trabajo demostrado", "Validación profesional", "Attestations onchain"].map((item, i) => <span key={item}><i>{String(i + 1).padStart(2, "0")}</i>{item}</span>)}</div></section>

      <section className="section container">
        <div className="section-heading split-heading"><div><span className="eyebrow">Cómo funciona</span><h2>Tres señales.<br />Una reputación real.</h2></div><p>No reducimos la confianza a un número opaco. Cada señal responde una pregunta diferente y conserva su contexto.</p></div>
        <div className="layer-grid">{layers.map(({ n, icon: Icon, question, name, body }) => <article key={n} className="layer-card"><div className="layer-top"><span>{n}</span><Icon size={22} /></div><p className="layer-question">{question}</p><h3>{name}</h3><p>{body}</p><Link href={n === "01" ? "/join" : "/projects"}>Conocer esta capa <ArrowUpRight size={14} /></Link></article>)}</div>
      </section>

      <section className="section section-tint"><div className="container">
        <div className="section-heading row-heading"><div><span className="eyebrow">Personas destacadas</span><h2>Talento que construye.</h2></div><Link className="arrow-link" href="/members">Ver toda la comunidad <ArrowRight size={16} /></Link></div>
        <div className="member-grid">{members.slice(0, 4).map((member, i) => <MemberCard key={member.id} member={member} index={i} />)}</div>
      </div></section>

      <section className="section container">
        <div className="section-heading row-heading"><div><span className="eyebrow">Proof of work</span><h2>Trabajo reciente,<br />con evidencia.</h2></div><Link className="arrow-link" href="/projects">Explorar proyectos <ArrowRight size={16} /></Link></div>
        <div className="contribution-grid">{contributions.slice(0, 3).map((contribution) => <ContributionCard key={contribution.id} contribution={contribution} />)}</div>
      </section>

      <section className="section organization-section"><div className="container">
        <div className="section-heading split-heading light"><div><span className="eyebrow">Organizaciones verificadas</span><h2>La comunidad también<br />se construye en equipo.</h2></div><p>Comunidades, protocolos y organizaciones pueden validar trabajo realizado para ellas.</p></div>
        <div className="org-row">{organizations.map((org, i) => <Link key={org.id} href={`/organizations/${org.slug}`}><span className={`org-logo avatar-tone-${i}`}>{org.initials}</span><div><b>{org.name}</b><small>{org.type} · {org.members} miembros</small></div><ArrowUpRight size={18} /></Link>)}</div>
      </div></section>

      <section className="cta-section container"><div><span className="eyebrow">Tu lugar en la red</span><h2>La confianza no se compra.<br /><em>Se construye.</em></h2><p>Crea tu perfil, conecta con quienes ya te conocen y deja que tu trabajo hable por ti.</p><Link className="button button-dark" href="/join">Comenzar mi perfil <ArrowRight size={17} /></Link></div><div className="cta-number"><span>5</span><p>personas que te conocen<br />abren la puerta a la red.</p></div></section>
    </main>
  );
}
