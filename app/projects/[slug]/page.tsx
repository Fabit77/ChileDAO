import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, ExternalLink } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { ContributionCard } from "@/components/contribution-card";
import { contributions, getProject, members, projects } from "@/lib/demo-data";

type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return projects.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> { return { title: getProject((await params).slug)?.name ?? "Proyecto" }; }
export default async function ProjectPage({ params }: Props) {
  const project = getProject((await params).slug); if (!project) notFound();
  const work = contributions.filter((c) => c.projectSlug === project.slug);
  const people = members.filter((m) => project.contributors.includes(m.name));
  return <main className="detail-page container"><Link className="back-link" href="/projects"><ArrowLeft size={15} /> Volver a proyectos</Link><section className="project-hero"><span className="eyebrow">Proyecto · {project.organization}</span><h1>{project.name}</h1><p>{project.description}</p><div className="hero-actions"><a className="button button-primary" href={project.website}>Visitar proyecto <ExternalLink size={15} /></a><Link className="button button-secondary" href={`/organizations/${project.organizationSlug}`}>Ver organización</Link></div></section><div className="project-detail-grid"><div><section className="profile-section"><div className="profile-section-title"><div><span className="eyebrow">Proof of work</span><h2>Contributions</h2></div><span>{work.length} registros</span></div><div className="profile-contributions">{work.map((c) => <ContributionCard key={c.id} contribution={c} />)}</div></section></div><aside><div className="side-panel"><span className="eyebrow">Contributors</span>{people.map((person, i) => <Link href={`/members/${person.slug}`} key={person.id}><Avatar initials={person.initials} size="small" index={i} /><span><b>{person.name}</b><small>{person.headline}</small></span><ArrowUpRight size={15} /></Link>)}</div><div className="side-panel"><span className="eyebrow">Skills del proyecto</span><div className="skill-list large">{project.skills.map((skill) => <span key={skill}><Check size={12} />{skill}</span>)}</div></div></aside></div></main>;
}
