import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/auth/session";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdmin();
  return <AdminShell role={user.role}>{children}</AdminShell>;
}
