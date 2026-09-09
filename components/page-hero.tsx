import type { ReactNode } from "react";

export function PageHero({ eyebrow, title, description, aside }: { eyebrow: string; title: string; description: string; aside?: ReactNode }) {
  return (
    <section className="page-hero container">
      <div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{description}</p></div>
      {aside && <div className="page-hero-aside">{aside}</div>}
    </section>
  );
}
