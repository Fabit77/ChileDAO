import Link from "next/link";
import { Award, LayoutDashboard, ShieldCheck, UserCog, Users } from "lucide-react";
import type { ReactNode } from "react";
import type { MembershipRole } from "@/lib/domain/membership";

const adminNav = [
  { href: "/admin", label: "Resumen", icon: LayoutDashboard },
  { href: "/admin/users", label: "Usuarios", icon: Users },
  { href: "/admin/badges", label: "Badges", icon: Award },
  { href: "/admin/superadmins", label: "Superadmins", icon: UserCog },
];

export function AdminShell({ children, role }: { children: ReactNode; role: MembershipRole }) {
  return <main className="admin-page container"><div className="admin-head"><div><span className="eyebrow">Zona protegida · {role}</span><h1>Administración</h1><p>Moderación y operaciones sensibles con historial auditable.</p></div><span className="status status-member"><ShieldCheck size={13} /> Acceso administrativo</span></div><nav className="admin-nav" aria-label="Administración">{adminNav.map(({ href, label, icon: Icon }) => <Link href={href} key={href}><Icon size={15} />{label}</Link>)}</nav>{children}</main>;
}
