const steps = [
  ["01", "Crea tu perfil", "Presenta quién eres y qué estás construyendo en el ecosistema."],
  ["02", "Consigue 5 validaciones", "Cinco miembros existentes deben confirmar que te conocen."],
  ["03", "Registra tu trabajo", "Documenta proyectos, contribuciones y evidencia pública."],
  ["04", "Construye reputación", "La comunidad valida tu trabajo y tus aptitudes con contexto."],
];

export default function Home() {
  return (
    <main>
      <header className="nav shell">
        <div className="brand">CHILE DAO</div>
        <nav>
          <a href="#como-funciona">Cómo funciona</a>
          <a href="#principio">Principio</a>
          <a className="button small" href="#join">Crear perfil</a>
        </nav>
      </header>

      <section className="hero shell">
        <div className="eyebrow">WEB3 · CHILE · REPUTATION NETWORK</div>
        <h1>La red de confianza del ecosistema Web3 chileno.</h1>
        <p className="lead">
          Para formar parte, otros miembros tienen que reconocerte. Una vez dentro,
          tu trabajo construye tu reputación.
        </p>
        <div className="actions">
          <a className="button" href="#como-funciona">Explorar comunidad</a>
          <a className="button ghost" href="#join">Crear mi perfil</a>
        </div>
        <div className="trust-card" id="principio">
          <span className="trust-kicker">COMMUNITY TRUST</span>
          <strong>5 / 5</strong>
          <p>Miembros distintos deben confirmar que te conocen antes de que puedas entrar.</p>
        </div>
      </section>

      <section className="section shell" id="como-funciona">
        <div className="section-head">
          <span>Cómo funciona</span>
          <h2>La reputación no se declara. Se demuestra.</h2>
        </div>
        <div className="grid">
          {steps.map(([number, title, copy]) => (
            <article className="card" key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell two-col">
        <div>
          <span className="eyebrow">TRES CAPAS</span>
          <h2>Confianza, trabajo y reputación.</h2>
        </div>
        <div className="principles">
          <div><b>01 · ¿Quién te conoce?</b><p>Membership Vouches.</p></div>
          <div><b>02 · ¿Qué has hecho?</b><p>Contributions / Proof of Work.</p></div>
          <div><b>03 · ¿Quién puede dar fe de tu trabajo?</b><p>Professional validations.</p></div>
        </div>
      </section>

      <section className="cta shell" id="join">
        <span className="eyebrow">CHILE DAO</span>
        <h2>Tu trabajo construye tu reputación.</h2>
        <p>Este repositorio ya está preparado para que Codex implemente el MVP completo.</p>
      </section>

      <footer className="shell footer">Chile DAO · Building trust onchain</footer>
    </main>
  );
}
