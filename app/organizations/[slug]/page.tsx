import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, ExternalLink, ShieldCheck } from "lucide-react";
import { getOrganization, organizations, projects } from "@/lib/demo-data";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return organizations.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { return { title: getOrganization((await params).slug)?.name ?? "Organización" }; }
export default async function OrganizationPage({ params }: Props) {
  const org = getOrganization((await params).slug); if (!org) notFound(); const orgProjects = projects.filter((p) => p.organizationSlug === org.slug); const index = organizations.indexOf(org);
  return <main className="detail-page container"><Link className="back-link" href="/organizations"><ArrowLeft size={15} /> Volver a organizaciones</Link><section className="organization-hero"><span className={`org-logo org-logo-hero avatar-tone-${index}`}>{org.initials}</span><div><span className="status status-member"><ShieldCheck size={13} /> Organización verificada</span><h1>{org.name}</h1><p>{org.description}</p><a className="arrow-link" href={org.website}>Visitar sitio <ExternalLink size={14} /></a></div><div className="org-hero-stats"><div><b>{org.members}</b><span>miembros</span></div><div><b>{org.projects}</b><span>proyectos</span></div><div><b>{orgProjects.reduce((sum, p) => sum + p.verifiedContributions, 0)}</b><span>contributions verificadas</span></div></div></section><section className="profile-section"><div className="profile-section-title"><div><span className="eyebrow">Construido en comunidad</span><h2>Proyectos relacionados</h2></div></div><div className="project-grid compact">{orgProjects.map((project) => <article className="project-card" key={project.id}><Link className="card-link" href={`/projects/${project.slug}`} /><div className="project-index">Proyecto <ArrowUpRight size={18} /></div><h2>{project.name}</h2><p>{project.description}</p><div className="skill-list">{project.skills.map((skill) => <span key={skill}>{skill}</span>)}</div></article>)}</div></section></main>;
}
