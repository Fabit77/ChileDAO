import "server-only";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import type { MembershipRole } from "@/lib/domain/membership";
import { db } from "@/lib/db";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type SessionUser = {
  id: string;
  authId: string;
  email: string;
  role: MembershipRole;
  githubUsername: string | null;
  profile: { username: string; slug: string; displayName: string; avatarUrl: string | null; headline: string | null; bio: string | null; location: string | null } | null;
};

function normalizedGithubUsername(user: SupabaseUser) {
  if (user.app_metadata.provider !== "github") return null;
  const value = user.user_metadata.user_name ?? user.user_metadata.preferred_username;
  return typeof value === "string" ? value.trim().toLowerCase() : null;
}

function bootstrapSuperAdmins() {
  return new Set((process.env.SUPERADMIN_GITHUB_USERNAMES ?? "").split(",").map((value) => value.trim().toLowerCase()).filter(Boolean));
}

async function provisionUser(authUser: SupabaseUser): Promise<SessionUser> {
  const email = authUser.email?.trim().toLowerCase();
  if (!email) throw new Error("AUTH_EMAIL_REQUIRED");
  const githubUsername = normalizedGithubUsername(authUser);
  const shouldBootstrap = Boolean(githubUsername && bootstrapSuperAdmins().has(githubUsername));
  const existing = await db.user.findFirst({ where: { OR: [{ authId: authUser.id }, { email }] }, select: { id: true, role: true } });
  const role = shouldBootstrap ? "SUPER_ADMIN" : existing?.role ?? "CANDIDATE";
  const elevated = shouldBootstrap ? { membershipSource: "FOUNDING" as const, memberSince: new Date() } : {};
  const user = existing
    ? await db.user.update({ where: { id: existing.id }, data: { authId: authUser.id, email, githubUsername, role, ...elevated }, include: { profile: { select: { username: true, slug: true, displayName: true, avatarUrl: true, headline: true, bio: true, location: true } } } })
    : await db.user.create({ data: { authId: authUser.id, email, githubUsername, role, ...elevated }, include: { profile: { select: { username: true, slug: true, displayName: true, avatarUrl: true, headline: true, bio: true, location: true } } } });
  return { ...user, role: user.role as MembershipRole };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  if (!supabase || !process.env.DATABASE_URL) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return provisionUser(data.user);
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) redirect("/auth/login?next=/dashboard");
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
