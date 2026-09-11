import "server-only";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { db } from "@/lib/db";
import type { Contribution, Member, Organization, Project } from "@/lib/types";
import { PUBLIC_CACHE_TAGS } from "@/lib/data/public-cache";

const publicRoles = ["MEMBER", "TRUSTED_MEMBER", "ADMIN", "SUPER_ADMIN"] as const;
const verifiedStatuses = ["COMMUNITY_VERIFIED", "ORGANIZATION_VERIFIED", "ONCHAIN_VERIFIED"] as const;

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
}

async function queryPublicMembers(limit: number | null): Promise<Member[]> {
  const users = await db.user.findMany({
    where: { deactivatedAt: null, role: { in: [...publicRoles] }, profile: { isNot: null } },
    include: {
      profile: true,
      vouchesReceived: { where: { isActive: true }, include: { validator: { include: { profile: true } } } },
      contributions: { select: { status: true } },
      skills: { include: { skill: true } },
      badges: { include: { badge: true } },
      organizationMemberships: { include: { organization: true } },
    },
    orderBy: { memberSince: "asc" },
    take: limit ?? undefined,
  });
  return users.flatMap((user) => user.profile ? [{
    id: user.id,
    slug: user.profile.slug,
    name: user.profile.displayName,
    username: user.profile.username,
    initials: initials(user.profile.displayName),
    headline: user.profile.headline ?? "Miembro del ecosistema Web3 chileno",
    bio: user.profile.bio ?? "",
    location: user.profile.location ?? "Chile",
    role: user.role,
    membershipSource: user.membershipSource,
    availability: user.profile.availability,
    vouchCount: user.vouchesReceived.length,
    publicVouchers: user.vouchesReceived.flatMap((item) => item.isPublic && item.validator.deactivatedAt === null && item.validator.profile ? [{ name: item.validator.profile.displayName, slug: item.validator.profile.slug, initials: initials(item.validator.profile.displayName) }] : []),
    verifiedContributions: user.contributions.filter((item) => verifiedStatuses.includes(item.status as typeof verifiedStatuses[number])).length,
    contributions: user.contributions.length,
    skills: user.skills.map((item) => ({ name: item.skill.name, level: item.evidenceLevel === "CONTRIBUTION_BACKED" ? "Con evidencia" as const : item.evidenceLevel === "COMMUNITY_VALIDATED" ? "Validada" as const : "Declarada" as const, endorsements: 0 })),
    badges: user.badges.map((item) => item.badge.name),
    organizations: user.organizationMemberships.map((item) => item.organization.name),
    joined: user.memberSince ? new Intl.DateTimeFormat("es-CL", { month: "long", year: "numeric" }).format(user.memberSince) : "",
    links: { github: user.profile.githubUrl ?? undefined, linkedin: user.profile.linkedinUrl ?? undefined, x: user.profile.xUrl ?? undefined, website: user.profile.websiteUrl ?? undefined },
  }] : []);
}

const cachedPublicMembers = unstable_cache(queryPublicMembers, ["public-members-v2"], {
  revalidate: 300,
  tags: [PUBLIC_CACHE_TAGS.members],
});

export async function getPublicMembers(limit?: number): Promise<Member[]> {
  await connection();
  if (!process.env.DATABASE_URL) return [];
  return cachedPublicMembers(limit ?? null);
}

const cachedPublicMember = unstable_cache(async (slug: string) => {
  const members = await cachedPublicMembers(null);
  const current = members.find((member) => member.slug === slug);
  if (current) return current;
  const historic = await db.profileUsernameHistory.findUnique({ where: { username: slug.toLowerCase() }, select: { profile: { select: { slug: true } } } });
  return historic ? members.find((member) => member.slug === historic.profile.slug) : undefined;
}, ["public-member-v2"], { revalidate: 300, tags: [PUBLIC_CACHE_TAGS.members] });

export async function getPublicMember(slug: string) {
  await connection();
  if (!process.env.DATABASE_URL) return undefined;
  return cachedPublicMember(slug.toLowerCase());
}

async function queryPublicContributions(limit: number | null): Promise<Contribution[]> {
  const records = await db.contribution.findMany({ where: { visibility: "PUBLIC", author: { deactivatedAt: null } }, include: { author: { include: { profile: true } }, project: true, organization: true, evidence: true, validations: { where: { decision: "VERIFIED" } } }, orderBy: { createdAt: "desc" }, take: limit ?? undefined });
  return records.flatMap((item) => item.author.profile ? [{ id: item.id, title: item.title, description: item.description, role: item.role, author: item.author.profile.displayName, authorSlug: item.author.profile.slug, project: item.project?.name, projectSlug: item.project?.slug, organization: item.organization?.name, status: item.status, validators: item.validations.length, evidenceType: item.evidence[0]?.type ?? "URL", evidenceUrl: item.evidence[0]?.url ?? "#", date: new Intl.DateTimeFormat("es-CL", { month: "short", year: "numeric" }).format(item.startDate) }] : []);
}

const cachedPublicContributions = unstable_cache(queryPublicContributions, ["public-contributions-v2"], {
  revalidate: 300,
  tags: [PUBLIC_CACHE_TAGS.contributions],
});

export async function getPublicContributions(limit?: number): Promise<Contribution[]> {
  await connection();
  if (!process.env.DATABASE_URL) return [];
  return cachedPublicContributions(limit ?? null);
}

async function queryPublicOrganizations(limit: number | null): Promise<Organization[]> {
  const records = await db.organization.findMany({ include: { _count: { select: { members: true, projects: true } } }, orderBy: { name: "asc" }, take: limit ?? undefined });
  return records.map((item) => ({ id: item.id, slug: item.slug, name: item.name, initials: initials(item.name), type: item.type, description: item.description, website: item.website ?? "#", verified: item.verificationStatus === "VERIFIED", members: item._count.members, projects: item._count.projects }));
}

const cachedPublicOrganizations = unstable_cache(queryPublicOrganizations, ["public-organizations-v2"], {
  revalidate: 300,
  tags: [PUBLIC_CACHE_TAGS.organizations],
});

export async function getPublicOrganizations(limit?: number): Promise<Organization[]> {
  await connection();
  if (!process.env.DATABASE_URL) return [];
  return cachedPublicOrganizations(limit ?? null);
}

async function queryPublicProjects(limit: number | null): Promise<Project[]> {
  const records = await db.project.findMany({ include: { organization: true, skills: { include: { skill: true } }, members: { where: { user: { deactivatedAt: null } }, include: { user: { include: { profile: true } } } }, contributions: { where: { author: { deactivatedAt: null } }, select: { status: true } } }, orderBy: { createdAt: "desc" }, take: limit ?? undefined });
  return records.map((item) => ({ id: item.id, slug: item.slug, name: item.name, description: item.description, organization: item.organization?.name ?? "Proyecto independiente", organizationSlug: item.organization?.slug ?? "", skills: item.skills.map((entry) => entry.skill.name), contributors: item.members.flatMap((entry) => entry.user.profile ? [entry.user.profile.displayName] : []), verifiedContributions: item.contributions.filter((entry) => verifiedStatuses.includes(entry.status as typeof verifiedStatuses[number])).length, website: item.website ?? "#" }));
}

const cachedPublicProjects = unstable_cache(queryPublicProjects, ["public-projects-v2"], {
  revalidate: 300,
  tags: [PUBLIC_CACHE_TAGS.projects],
});

export async function getPublicProjects(limit?: number): Promise<Project[]> {
  await connection();
  if (!process.env.DATABASE_URL) return [];
  return cachedPublicProjects(limit ?? null);
}
