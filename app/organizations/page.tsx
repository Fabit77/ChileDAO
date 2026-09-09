import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getPublicOrganizations } from "@/lib/data/public";

export const metadata: Metadata = { title: "Organizaciones" };
export default async function OrganizationsPage() {
  const organizations = await getPublicOrganizations();
  return <main className="listing-page"><PageHero eyebrow="Ecosistema" title="Organizaciones que pueden dar fe del trabajo." description="Comunidades, protocolos y equipos verificados que participan en la red de reputación." /><section className="container listing-content">{organizations.length ? <div className="organization-grid">{organizations.map((org, i) => <article className="organization-card" key={org.id}><Link className="card-link" href={`/organizations/${org.slug}`} /><div className="org-card-top"><span className={`org-logo org-logo-large avatar-tone-${i}`}>{org.initials}</span><ArrowUpRight size={20} /></div><span className={`status ${org.verified ? "status-member" : ""}`}><ShieldCheck size={13} /> {org.verified ? "Organización verificada" : "Verificación pendiente"}</span><h2>{org.name}</h2><p>{org.description}</p><div className="org-stats"><span><b>{org.members}</b> miembros</span><span><b>{org.projects}</b> proyectos</span><span>{org.type}</span></div></article>)}</div> : <div className="empty-state"><h3>Aún no hay organizaciones</h3><p>Las organizaciones reales aparecerán aquí después de registrarse y ser verificadas.</p></div>}</section></main>;
}
