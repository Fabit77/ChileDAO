import "server-only";
import { redirect } from "next/navigation";
import { cache } from "react";
import type { MembershipRole } from "@/lib/domain/membership";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  authId: string;
  email: string;
  role: MembershipRole;
  githubUsername: string | null;
  deactivatedAt: Date | null;
  termsAcceptedAt: Date | null;
  privacyAcceptedAt: Date | null;
  profile: { id: string; username: string; slug: string; usernameChangedAt: Date | null; displayName: string; avatarUrl: string | null; headline: string | null; bio: string | null; location: string | null } | null;
};

type AuthIdentity = {
  id: string;
  email?: string;
  app_metadata: Record<string, unknown>;
  user_metadata: Record<string, unknown>;
};

function normalizedGithubUsername(user: AuthIdentity) {
  if (user.app_metadata.provider !== "github") return null;
  const value = user.user_metadata.user_name ?? user.user_metadata.preferred_username;
  return typeof value === "string" ? value.trim().toLowerCase() : null;
}

function bootstrapSuperAdmins() {
  return new Set((process.env.SUPERADMIN_GITHUB_USERNAMES ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean));
}

async function provisionUser(authUser: AuthIdentity): Promise<SessionUser> {
  const email = authUser.email?.trim().toLowerCase();
  if (!email) throw new Error("AUTH_EMAIL_REQUIRED");
  const githubUsername = normalizedGithubUsername(authUser);
  const shouldBootstrap = Boolean(githubUsername && bootstrapSuperAdmins().has(githubUsername));
  const profile = { select: { id: true, username: true, slug: true, usernameChangedAt: true, displayName: true, avatarUrl: true, headline: true, bio: true, location: true } } as const;
  const existing = await db.user.findUnique({ where: { authId: authUser.id }, include: { profile } });
  if (existing) {
    const identityChanged = existing.email !== email || existing.githubUsername !== githubUsername;
    const needsBootstrap = shouldBootstrap && existing.role !== "SUPER_ADMIN";
    if (!identityChanged && !needsBootstrap) return { ...existing, role: existing.role as MembershipRole };
    const updated = await db.user.update({
      where: { id: existing.id },
      data: { email, githubUsername, ...(needsBootstrap ? { role: "SUPER_ADMIN", membershipSource: "FOUNDING", memberSince: existing.memberSince ?? new Date() } : {}) },
      include: { profile },
    });
    return { ...updated, role: updated.role as MembershipRole };
  }
  const user = await db.user.create({
    data: { authId: authUser.id, email, githubUsername, role: shouldBootstrap ? "SUPER_ADMIN" : "CANDIDATE", ...(shouldBootstrap ? { membershipSource: "FOUNDING", memberSince: new Date() } : {}) },
    include: { profile: { select: { id: true, username: true, slug: true, usernameChangedAt: true, displayName: true, avatarUrl: true, headline: true, bio: true, location: true } } },
  });
  return { ...user, role: user.role as MembershipRole };
}

export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !process.env.DATABASE_URL) return null;
  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) return null;
  const claims = data.claims;
  return provisionUser({
    id: claims.sub,
    email: claims.email,
    app_metadata: claims.app_metadata ?? {},
    user_metadata: claims.user_metadata ?? {},
  });
});

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/dashboard");
  if (user.deactivatedAt) redirect("/auth/account-disabled");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") redirect("/dashboard");
  return user;
}

export async function requireSuperAdmin() {
  const user = await requireUser();
  if (user.role !== "SUPER_ADMIN") redirect("/dashboard");
  return user;
}
