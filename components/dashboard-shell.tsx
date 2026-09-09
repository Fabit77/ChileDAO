import Link from "next/link";
import { Award, CircleUserRound, FileCheck2, Gauge, KeyRound, ListChecks, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import type { SessionUser } from "@/lib/auth/session";

const nav = [{ href: "/dashboard", label: "Overview", icon: Gauge }, { href: "/dashboard/profile", label: "Mi perfil", icon: CircleUserRound }, { href: "/dashboard/contributions", label: "Contributions", icon: FileCheck2 }, { href: "/dashboard/requests", label: "Solicitudes", icon: ListChecks }, { href: "/dashboard#skills", label: "Skills", icon: Sparkles }, { href: "/dashboard#badges", label: "Badges", icon: Award }, { href: "/dashboard#wallet", label: "Wallet / Onchain", icon: KeyRound }];

export function DashboardShell({ children, active = "Overview", candidate = false, user, vouchCount = 0 }: { children: ReactNode; active?: string; candidate?: boolean; user?: SessionUser; vouchCount?: number }) {
  const name = user?.profile?.displayName ?? "Mi cuenta";
  const initials = name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  return <main className="dashboard-page"><aside className="dashboard-sidebar"><div className="dash-user"><span className={`avatar avatar-medium ${candidate ? "avatar-tone-4" : "avatar-tone-1"}`}>{initials}</span><div><b>{name}</b><small>{user?.role ?? "Cuenta"}</small></div></div><nav>{nav.map(({ href, label, icon: Icon }) => <Link key={label} className={active === label ? "active" : ""} href={href}><Icon size={17} />{label}</Link>)}</nav><div className="dash-trust"><ShieldCheck size={18} /><b>{candidate ? `${vouchCount} / 5 vouches` : "Miembro verificado"}</b><p>{candidate ? `Te faltan ${Math.max(0, 5 - vouchCount)} personas para entrar.` : user?.role === "SUPER_ADMIN" ? "Superadmin de plataforma" : "Identidad verificada"}</p></div></aside><section className="dashboard-content">{children}</section></main>;
}
