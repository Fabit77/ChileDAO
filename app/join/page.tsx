import type { Metadata } from "next";
import { Github, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { signInWithGithub } from "@/app/auth/actions";
import { getSessionUser } from "@/lib/auth/session";
import { createProfile } from "./actions";

export const metadata: Metadata = { title: "Crear perfil" };

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getSessionUser();
  const { error } = await searchParams;
  if (user?.profile) redirect("/dashboard");
  if (!user) return <main className="join-page"><div className="join-shell"><section className="join-card"><span className="join-icon"><ShieldCheck /></span><span className="eyebrow">Tu identidad, sin fricción</span><h1>Crea una cuenta real.</h1><p>GitHub confirma tu identidad de acceso. Tu email será privado y la wallet seguirá siendo opcional.</p><form action={signInWithGithub}><button className="auth-button" type="submit"><Github size={19} /> Continuar con GitHub</button></form><small>No usamos perfiles demo: cada persona crea y controla su propio perfil.</small></section></div></main>;
  return <main className="join-page"><div className="join-shell"><section className="join-card join-form"><span className="eyebrow">Perfil público</span><h1>¿Cómo te conoce la comunidad?</h1><p>Completas esto una sola vez. Comenzarás como Candidate, salvo el superadmin inicial.</p>{error && <p className="form-error">{error === "username-taken" ? "Ese username ya está en uso." : "Revisa los datos del perfil."}</p>}<form action={createProfile}><div className="form-grid"><label>Nombre visible<input name="displayName" required defaultValue={user.githubUsername ?? ""} /></label><label>Username<div className="input-prefix"><span>@</span><input name="username" required pattern="[a-z0-9_-]{2,30}" defaultValue={user.githubUsername ?? ""} /></div></label><label className="full">¿Qué haces?<input name="headline" placeholder="Frontend developer · Web3 builder" /></label><label className="full">Ubicación<input name="location" defaultValue="Chile" /></label><label className="full">Bio<textarea name="bio" maxLength={500} placeholder="Cuenta brevemente qué construyes y qué te interesa..." /></label></div><button className="button button-primary" type="submit">Crear perfil</button></form></section></div></main>;
}
