import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { organizations } from "@/lib/demo-data";

export const metadata: Metadata = { title: "Organizaciones" };
export default function OrganizationsPage() {
  return <main className="listing-page"><PageHero eyebrow="Ecosistema" title="Organizaciones que pueden dar fe del trabajo." description="Comunidades, protocolos y equipos verificados que participan en la red de reputación." /><section className="container listing-content"><div className="organization-grid">{organizations.map((org, i) => <article className="organization-card" key={org.id}><Link className="card-link" href={`/organizations/${org.slug}`} /><div className="org-card-top"><span className={`org-logo org-logo-large avatar-tone-${i}`}>{org.initials}</span><ArrowUpRight size={20} /></div><span className="status status-member"><ShieldCheck size={13} /> Organización verificada</span><h2>{org.name}</h2><p>{org.description}</p><div className="org-stats"><span><b>{org.members}</b> miembros</span><span><b>{org.projects}</b> proyectos</span><span>{org.type}</span></div></article>)}</div></section></main>;
}
