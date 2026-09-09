import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Member } from "@/lib/types";
import { Avatar } from "./avatar";
import { MemberVerified } from "./status-pill";

export function MemberCard({ member, index = 0 }: { member: Member; index?: number }) {
  return (
    <article className="member-card">
      <Link className="card-link" href={`/members/${member.slug}`} aria-label={`Ver perfil de ${member.name}`} />
      <div className="member-card-top">
        <Avatar initials={member.initials} size="large" index={index} />
        <ArrowUpRight className="card-arrow" size={20} />
      </div>
      <MemberVerified founding={member.membershipSource === "FOUNDING"} />
      <h3>{member.name}</h3>
      <p className="member-headline">{member.headline}</p>
      <span className="member-location"><MapPin size={13} />{member.location}</span>
      <div className="skill-list">
        {member.skills.slice(0, 3).map((skill) => <span key={skill.name}>{skill.name}</span>)}
      </div>
      <div className="member-stats">
        <span><b>{member.verifiedContributions}</b> trabajos verificados</span>
        <span><b>{member.vouchCount}</b> vouches</span>
      </div>
    </article>
  );
}
