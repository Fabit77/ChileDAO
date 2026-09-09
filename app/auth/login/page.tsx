import type { Metadata } from "next";
import { Github, ShieldCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { signInWithGithub } from "@/app/auth/actions";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Ingresar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await getSessionUser();
  if (user) redirect(user.profile ? "/dashboard" : "/join");
  const error = (await searchParams).error;
  return <main className="login-page"><section className="login-card"><span className="join-icon"><ShieldCheck /></span><span className="eyebrow">Identidad real</span><h1>Ingresa a Chile DAO.</h1><p>Usa GitHub para crear una identidad reconocible. Tu email nunca se publica.</p>{error && <p className="form-error">{error === "not-configured" ? "Supabase todavía no está configurado." : "No pudimos completar el ingreso. Intenta nuevamente."}</p>}<form action={signInWithGithub}><button className="auth-button" type="submit"><Github size={19} /> Continuar con GitHub</button></form><small>Los perfiles y roles se guardan de forma persistente en Supabase.</small></section></main>;
}
