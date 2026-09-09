"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { MemberCard } from "@/components/member-card";
import type { Member } from "@/lib/types";

export function MemberDirectory({ members }: { members: Member[] }) {
  const [query, setQuery] = useState("");
  const [skill, setSkill] = useState("Todas las skills");
  const [availability, setAvailability] = useState("Toda disponibilidad");
  const filtered = useMemo(() => members.filter((member) => {
    const search = `${member.name} ${member.headline} ${member.location} ${member.skills.map((s) => s.name).join(" ")}`.toLowerCase();
    return search.includes(query.toLowerCase()) && (skill === "Todas las skills" || member.skills.some((s) => s.name === skill)) && (availability === "Toda disponibilidad" || member.availability.includes(availability));
  }), [availability, members, query, skill]);

  return <>
    <div className="filter-bar">
      <label className="search-field"><Search size={17} /><span className="sr-only">Buscar personas</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Buscar por nombre, skill o ciudad" /></label>
      <label><span className="sr-only">Filtrar por skill</span><select value={skill} onChange={(event) => setSkill(event.target.value)}><option>Todas las skills</option><option>Solidity</option><option>UX/UI</option><option>Community Building</option><option>Governance</option><option>Rust</option><option>DevRel</option></select></label>
      <label><span className="sr-only">Filtrar por disponibilidad</span><select value={availability} onChange={(event) => setAvailability(event.target.value)}><option>Toda disponibilidad</option><option>FREELANCE</option><option>FULL_TIME</option><option>PART_TIME</option><option>ADVISORY</option><option>BOUNTIES</option></select></label>
      <span className="result-count"><SlidersHorizontal size={15} /> {filtered.length} personas</span>
    </div>
    {filtered.length ? <div className="member-grid directory-grid">{filtered.map((member, i) => <MemberCard key={member.id} member={member} index={i} />)}</div> : <div className="empty-state"><h3>No encontramos coincidencias</h3><p>Prueba con otra skill o elimina algún filtro.</p></div>}
  </>;
}
