import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { getPublicMembers } from "@/lib/data/public";
import { MemberDirectory } from "./member-directory";

export const metadata: Metadata = { title: "Personas" };

export default async function MembersPage() {
  const members = await getPublicMembers();
  return <main className="listing-page"><PageHero eyebrow="Directorio de talento" title="Personas que hacen Web3 desde Chile." description="Descubre talento real por trabajo demostrado, skills validadas y relaciones dentro de la comunidad." aside={<div className="hero-metric"><b>{members.length}</b><span>miembros<br />verificados</span></div>} /><section className="container listing-content"><MemberDirectory members={members} /></section></main>;
}
