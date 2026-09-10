export type SkillSignal = {
  name: string;
  level: "Declarada" | "Validada" | "Con evidencia";
  endorsements: number;
};

export type Member = {
  id: string;
  slug: string;
  name: string;
  username: string;
  initials: string;
  headline: string;
  bio: string;
  location: string;
  role: "MEMBER" | "TRUSTED_MEMBER" | "ADMIN" | "SUPER_ADMIN" | "CANDIDATE" | "QUALIFIED";
  membershipSource: "FOUNDING" | "VOUCHED" | null;
  availability: string[];
  vouchCount: number;
  publicVouchers: { name: string; slug: string; initials: string }[];
  verifiedContributions: number;
  contributions: number;
  skills: SkillSignal[];
  badges: string[];
  organizations: string[];
  joined: string;
  links: { github?: string; linkedin?: string; x?: string; website?: string };
};

export type Organization = {
  id: string;
  slug: string;
  name: string;
  initials: string;
  type: string;
  description: string;
  website: string;
  verified: boolean;
  members: number;
  projects: number;
};

export type Project = {
  id: string;
  slug: string;
  name: string;
  description: string;
  organization: string;
  organizationSlug: string;
  skills: string[];
  contributors: string[];
  verifiedContributions: number;
  website: string;
};

export type Contribution = {
  id: string;
  title: string;
  description: string;
  role: string;
  author: string;
  authorSlug: string;
  project?: string;
  projectSlug?: string;
  organization?: string;
  status:
    | "SELF_CLAIMED"
    | "COMMUNITY_VERIFIED"
    | "ORGANIZATION_VERIFIED"
    | "ONCHAIN_VERIFIED"
    | "DISPUTED";
  validators: number;
  evidenceType: string;
  evidenceUrl: string;
  date: string;
};
