import { PrismaClient, MembershipRole, MembershipSource, OrganizationType, VerificationStatus, ContributionStatus, EvidenceType, Visibility, SkillEvidenceLevel, ValidationDecision } from "@prisma/client";
import { members, candidates, organizations, projects, contributions, skills } from "../lib/demo-data";

const prisma = new PrismaClient();
const categories: Record<string, string> = {
  Solidity: "Development", "Smart Contracts": "Development", Rust: "Development", Frontend: "Development", Backend: "Development", "Full Stack": "Development", DevRel: "Development",
  Product: "Product & Design", "UX/UI": "Product & Design", Design: "Product & Design",
  "Community Building": "Community & Growth", Marketing: "Community & Growth", Growth: "Community & Growth", "Social Media": "Community & Growth", Content: "Community & Growth",
  Events: "Ecosystem", Education: "Ecosystem", Research: "Ecosystem", Partnerships: "Ecosystem", Governance: "Ecosystem", Founder: "Ecosystem",
};
const slugify = (value: string) => value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  for (const skill of skills) await prisma.skill.upsert({ where: { slug: slugify(skill) }, update: {}, create: { name: skill, slug: slugify(skill), category: categories[skill] } });
  for (const badge of ["Founding Member", "5 Verified Contributions", "10 Verified Contributions", "Trusted Validator", "Hackathon Builder", "Web3 Educator", "Community Builder", "Speaker"]) {
    await prisma.badge.upsert({ where: { slug: slugify(badge) }, update: {}, create: { name: badge, slug: slugify(badge), description: `Reconocimiento de comunidad: ${badge}.`, icon: "sparkle", criteriaType: "MANUAL", criteria: { version: 1 }, isAutomatic: false } });
  }

  const userIds = new Map<string, string>();
  for (const person of [...members, ...candidates]) {
    const role = MembershipRole[person.role];
    const user = await prisma.user.upsert({ where: { email: `${person.username}@demo.chiledao.cl` }, update: { role }, create: { email: `${person.username}@demo.chiledao.cl`, role, membershipSource: MembershipSource[person.membershipSource], memberSince: person.role === "MEMBER" || person.role === "ADMIN" || person.role === "TRUSTED_MEMBER" ? new Date("2025-04-01") : null, qualifiedAt: person.role === "QUALIFIED" ? new Date() : null, profile: { create: { username: person.username, slug: person.slug, displayName: person.name, headline: person.headline, bio: person.bio, location: person.location, availability: person.availability.filter((value) => ["NOT_LOOKING", "FREELANCE", "FULL_TIME", "PART_TIME", "ADVISORY", "BOUNTIES", "HACKATHONS", "SPEAKING"].includes(value)) as never[] } } } });
    userIds.set(person.slug, user.id);
    for (const personSkill of person.skills) {
      const skill = await prisma.skill.findUniqueOrThrow({ where: { slug: slugify(personSkill.name) } });
      await prisma.userSkill.upsert({ where: { userId_skillId: { userId: user.id, skillId: skill.id } }, update: {}, create: { userId: user.id, skillId: skill.id, evidenceLevel: personSkill.level === "Con evidencia" ? SkillEvidenceLevel.CONTRIBUTION_BACKED : personSkill.level === "Validada" ? SkillEvidenceLevel.COMMUNITY_VALIDATED : SkillEvidenceLevel.SELF_DECLARED } });
    }
  }

  const orgIds = new Map<string, string>();
  const orgType: Record<string, OrganizationType> = { Educación: OrganizationType.NONPROFIT, Comunidad: OrganizationType.COMMUNITY, Protocolo: OrganizationType.PROTOCOL };
  for (const item of organizations) { const org = await prisma.organization.upsert({ where: { slug: item.slug }, update: {}, create: { name: item.name, slug: item.slug, description: item.description, website: item.website, type: orgType[item.type] ?? OrganizationType.OTHER, verificationStatus: VerificationStatus.VERIFIED } }); orgIds.set(item.slug, org.id); }
  const projectIds = new Map<string, string>();
  for (const item of projects) { const project = await prisma.project.upsert({ where: { slug: item.slug }, update: {}, create: { name: item.name, slug: item.slug, description: item.description, website: item.website, organizationId: orgIds.get(item.organizationSlug) } }); projectIds.set(item.slug, project.id); }

  for (const item of contributions) {
    if (await prisma.contribution.findFirst({ where: { title: item.title, authorId: userIds.get(item.authorSlug) } })) continue;
    await prisma.contribution.create({ data: { authorId: userIds.get(item.authorSlug)!, projectId: item.projectSlug ? projectIds.get(item.projectSlug) : undefined, organizationId: item.projectSlug ? orgIds.get(projects.find((p) => p.slug === item.projectSlug)?.organizationSlug ?? "") : undefined, title: item.title, description: item.description, role: item.role, startDate: new Date("2026-01-15"), status: ContributionStatus[item.status], visibility: Visibility.PUBLIC, evidence: { create: { type: item.evidenceType === "GitHub" ? EvidenceType.GITHUB : item.evidenceType === "Deck" ? EvidenceType.DECK : item.evidenceType === "Video" ? EvidenceType.VIDEO : EvidenceType.URL, url: item.evidenceUrl, metadata: { seeded: true } } } } });
  }

  const martinaId = userIds.get("martina-saez")!; const diegoId = userIds.get("diego-munoz")!;
  for (const [candidateId, validators] of [[martinaId, members.slice(0, 3)], [diegoId, members.slice(0, 5)]] as const) {
    for (const validator of validators) await prisma.membershipVouch.upsert({ where: { validatorId_candidateId: { validatorId: userIds.get(validator.slug)!, candidateId } }, update: { isActive: true }, create: { validatorId: userIds.get(validator.slug)!, candidateId, validatorRole: MembershipRole[validator.role], isPublic: true } });
  }

  const sample = await prisma.contribution.findFirst({ where: { status: { not: ContributionStatus.SELF_CLAIMED } } });
  if (sample && !await prisma.contributionValidation.findFirst({ where: { contributionId: sample.id, validatorId: userIds.get("camila-soto")!, organizationId: null } })) await prisma.contributionValidation.create({ data: { contributionId: sample.id, validatorId: userIds.get("camila-soto")!, decision: ValidationDecision.VERIFIED, respondedAt: new Date() } });
  console.info(`Seed completo: ${members.length} miembros, ${candidates.length} candidatos, ${organizations.length} organizaciones, ${projects.length} proyectos y ${contributions.length} contributions.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; }).finally(async () => prisma.$disconnect());
