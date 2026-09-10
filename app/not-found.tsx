import Link from "next/link";

export default function NotFound() {
  return <main className="state-page container"><span className="eyebrow">404</span><h1>No encontramos esta página.</h1><p>El enlace puede haber cambiado o el contenido ya no está disponible.</p><Link className="button button-primary" href="/">Volver al inicio</Link></main>;
}
