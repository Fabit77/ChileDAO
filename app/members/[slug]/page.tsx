import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ArrowLeft, Github, Globe, Linkedin, MapPin, ShieldCheck } from "lucide-react";
import { Avatar } from "@/components/avatar";
import { ContributionCard } from "@/components/contribution-card";
import { MemberVerified } from "@/components/status-pill";
import { ShareProfileButton } from "@/components/share-profile-button";
import { getPublicContributions, getPublicMember, getPublicMembers } from "@/lib/data/public";

type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> { const member = await getPublicMember((await params).slug); return { title: member?.name ?? "Perfil" }; }

export default async function MemberPage({ params }: Props) {
  const requestedSlug = (await params).slug.toLowerCase();
  const [member, members, allWork] = await Promise.all([getPublicMember(requestedSlug), getPublicMembers(), getPublicContributions()]);
  if (!member) notFound();
  if (member.slug !== requestedSlug) permanentRedirect(`/members/${member.slug}`);
  const work = allWork.filter((item) => item.authorSlug === member.slug);
  return <main className="profile-page container">
    <Link className="back-link" href="/members"><ArrowLeft size={15} /> Volver a personas</Link>
    <section className="profile-header">
      <div className="profile-identity"><Avatar initials={member.initials} size="hero" index={members.indexOf(member)} /><div><MemberVerified founding={member.membershipSource === "FOUNDING"} /><h1>{member.name}</h1><p className="profile-handle">@{member.username}</p><p className="profile-headline">{member.headline}</p><span className="member-location"><MapPin size={14} />{member.location}</span></div></div>
      <div className="profile-actions"><Link className="button button-primary" href="#trabajo">Ver trabajo</Link><ShareProfileButton /></div>
    </section>
    <div className="profile-layout">
      <div className="profile-main">
        <section className="profile-section"><span className="eyebrow">Sobre mí</span><p className="profile-bio">{member.bio}</p><div className="social-links">{member.links.github && <a href={member.links.github} target="_blank" rel="noreferrer"><Github size={16} /> GitHub</a>}{member.links.linkedin && <a href={member.links.linkedin} target="_blank" rel="noreferrer"><Linkedin size={16} /> LinkedIn</a>}{member.links.website && <a href={member.links.website} target="_blank" rel="noreferrer"><Globe size={16} /> Website</a>}</div></section>
        <section className="profile-section" id="trabajo"><div className="profile-section-title"><div><span className="eyebrow">¿Qué ha hecho?</span><h2>Trabajo demostrado</h2></div><span>{work.length} contributions</span></div>{work.length ? <div className="profile-contributions">{work.map((item) => <ContributionCard key={item.id} contribution={item} />)}</div> : <div className="empty-panel">Aún no hay contributions públicas.</div>}</section>
        <section className="profile-section"><span className="eyebrow">¿Quién da fe de su trabajo?</span><h2>Skills y endorsements</h2><div className="skills-table">{member.skills.map((skill) => <div key={skill.name}><span><b>{skill.name}</b><small>{skill.level}</small></span><strong>{skill.endorsements}</strong><em>endorsements</em></div>)}</div></section>
      </div>
      <aside className="profile-aside">
        <div className="trust-summary"><span className="eyebrow">Community trust</span><div className="trust-count"><b>{member.vouchCount}</b><span>personas confirman<br />que le conocen</span></div>{member.publicVouchers.length ? <div className="public-voucher-list">{member.publicVouchers.map((validator, index) => <Link href={`/members/${validator.slug}`} key={validator.slug}><Avatar initials={validator.initials} size="small" index={index} /><span>{validator.name}</span></Link>)}</div> : <small>No hay validadores públicos para mostrar.</small>}<p><ShieldCheck size={14} /> Los vouches solo confirman identidad comunitaria. No son recomendaciones profesionales.</p></div>
        <div className="reputation-facts"><span className="eyebrow">Señales observables</span><div><b>{member.contributions}</b><span>contributions</span></div><div><b>{member.verifiedContributions}</b><span>verificadas</span></div><div><b>{member.skills.reduce((sum, s) => sum + s.endorsements, 0)}</b><span>endorsements</span></div><div><b>{member.badges.length}</b><span>badges</span></div></div>
        <div className="badge-panel"><span className="eyebrow">Badges</span>{member.badges.map((badge) => <span key={badge}>✦ {badge}</span>)}</div>
      </aside>
    </div>
  </main>;
}
