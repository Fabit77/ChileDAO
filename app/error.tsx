"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return <main className="state-page container"><span className="eyebrow">Error temporal</span><h1>No pudimos cargar esta sección.</h1><p>Tus datos no se han perdido. Intenta nuevamente.</p><button className="button button-primary" type="button" onClick={reset}>Reintentar</button></main>;
}
