import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, FileCheck2 } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { getPublicProjects } from "@/lib/data/public";

export const metadata: Metadata = { title: "Proyectos" };
export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return <main className="listing-page"><PageHero eyebrow="Construido por la comunidad" title="Proyectos con historia verificable." description="Iniciativas abiertas, productos y programas donde el talento se demuestra trabajando." aside={<div className="hero-metric"><b>{projects.length}</b><span>proyectos<br />registrados</span></div>} /><section className="container listing-content">{projects.length ? <div className="project-grid">{projects.map((project, index) => <article className="project-card" key={project.id}><Link className="card-link" href={`/projects/${project.slug}`} /><div className="project-index">{String(index + 1).padStart(2, "0")}<ArrowUpRight size={19} /></div><span className="project-org">{project.organization}</span><h2>{project.name}</h2><p>{project.description}</p><div className="skill-list">{project.skills.map((skill) => <span key={skill}>{skill}</span>)}</div><div className="project-footer"><span>{project.contributors.length} contributors</span><span><FileCheck2 size={14} /> {project.verifiedContributions} verificadas</span></div></article>)}</div> : <div className="empty-state"><h3>Aún no hay proyectos</h3><p>Los miembros podrán registrar los primeros proyectos de la comunidad.</p></div>}</section></main>;
}
