import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { members } from "@/lib/demo-data";
import { MemberDirectory } from "./member-directory";

export const metadata: Metadata = { title: "Personas" };

export default function MembersPage() {
  return <main className="listing-page"><PageHero eyebrow="Directorio de talento" title="Personas que hacen Web3 desde Chile." description="Descubre talento por trabajo demostrado, skills validadas y relaciones reales dentro de la comunidad." aside={<div className="hero-metric"><b>{members.length}</b><span>perfiles demo<br />verificados</span></div>} /><section className="container listing-content"><MemberDirectory members={members} /></section></main>;
}
