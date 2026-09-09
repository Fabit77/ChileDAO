import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Contribution } from "@/lib/types";
import { ContributionStatus } from "./status-pill";

export function ContributionCard({ contribution }: { contribution: Contribution }) {
  return (
    <article className="contribution-card">
      <div className="contribution-meta"><ContributionStatus status={contribution.status} /><span>{contribution.date}</span></div>
      <h3>{contribution.title}</h3>
      <p>{contribution.description}</p>
      <div className="contribution-context">
        <div><span>Por</span><Link href={`/members/${contribution.authorSlug}`}>{contribution.author} <ArrowUpRight size={12} /></Link></div>
        {contribution.project && <div><span>En</span><Link href={`/projects/${contribution.projectSlug}`}>{contribution.project}</Link></div>}
      </div>
      <div className="contribution-footer"><span>{contribution.validators ? `Validada por ${contribution.validators}` : "Aún sin validaciones"}</span><a href={contribution.evidenceUrl} target="_blank" rel="noreferrer">{contribution.evidenceType}<ExternalLink size={13} /></a></div>
    </article>
  );
}
