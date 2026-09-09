"use client";
import Link from "next/link";
import { ArrowRight, ShieldCheck, UserRound } from "lucide-react";
import { Avatar } from "@/components/avatar";

const accounts = [{ initials: "CS", name: "Camila Soto", role: "Miembro verificado", href: "/dashboard" }, { initials: "MS", name: "Martina Sáez", role: "Candidate · 3/5 vouches", href: "/dashboard?view=candidate" }, { initials: "IR", name: "Isidora Rojas", role: "Admin", href: "/admin" }];
export function DemoLogin() { return <div className="login-card"><span className="eyebrow">Acceso de demostración</span><h1>Elige una perspectiva.</h1><p>Explora los permisos y flujos de cada rol sin credenciales externas.</p><div className="account-list">{accounts.map((account, i) => <Link href={account.href} key={account.name} onClick={() => localStorage.setItem("chiledao_role", account.role)}><Avatar initials={account.initials} index={i} /><span><b>{account.name}</b><small>{account.role}</small></span>{i === 2 ? <ShieldCheck size={18} /> : <UserRound size={18} />}<ArrowRight size={17} /></Link>)}</div><small>En producción, este adaptador se reemplaza por GitHub/Google OAuth.</small></div>; }
