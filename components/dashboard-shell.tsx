import Link from "next/link";
import { Award, CircleUserRound, FileCheck2, Gauge, KeyRound, ListChecks, ShieldCheck, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const nav = [{ href: "/dashboard", label: "Overview", icon: Gauge }, { href: "/dashboard/profile", label: "Mi perfil", icon: CircleUserRound }, { href: "/dashboard/contributions", label: "Contributions", icon: FileCheck2 }, { href: "/dashboard/requests", label: "Solicitudes", icon: ListChecks }, { href: "/dashboard#skills", label: "Skills", icon: Sparkles }, { href: "/dashboard#badges", label: "Badges", icon: Award }, { href: "/dashboard#wallet", label: "Wallet / Onchain", icon: KeyRound }];

export function DashboardShell({ children, active = "Overview", candidate = false }: { children: ReactNode; active?: string; candidate?: boolean }) {
  return <main className="dashboard-page"><aside className="dashboard-sidebar"><div className="dash-user"><span className={`avatar avatar-medium ${candidate ? "avatar-tone-4" : "avatar-tone-1"}`}>{candidate ? "MS" : "CS"}</span><div><b>{candidate ? "Martina Sáez" : "Camila Soto"}</b><small>{candidate ? "Candidate" : "Member"}</small></div></div><nav>{nav.map(({ href, label, icon: Icon }) => <Link key={label} className={active === label ? "active" : ""} href={candidate && href === "/dashboard" ? "/dashboard?view=candidate" : href}><Icon size={17} />{label}{label === "Solicitudes" && <span>3</span>}</Link>)}</nav><div className="dash-trust"><ShieldCheck size={18} /><b>{candidate ? "3 / 5 vouches" : "Miembro verificado"}</b><p>{candidate ? "Te faltan 2 personas para entrar." : "Desde abril de 2025"}</p></div></aside><section className="dashboard-content">{children}</section></main>;
}
