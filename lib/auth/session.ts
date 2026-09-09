import "server-only";
import type { MembershipRole } from "@/lib/domain/membership";

export type SessionUser = { id: string; role: MembershipRole };

export async function getSessionUser(): Promise<SessionUser | null> {
  // A production OAuth adapter replaces this branch. We deliberately do not
  // accept a client-authored demo cookie as an authorization source.
  return process.env.DEMO_MODE === "false" ? null : { id: "m3", role: "TRUSTED_MEMBER" };
}

export async function requireUser() {
  const user = await getSessionUser();
  if (!user) throw new Error("UNAUTHORIZED");
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== "ADMIN") {
    if (process.env.DEMO_MODE === "false") throw new Error("FORBIDDEN");
    return { id: "m1", role: "ADMIN" as const };
  }
  return user;
}
