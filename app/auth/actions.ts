"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function signInWithGithub() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) redirect("/auth/login?error=not-configured");
  const origin = (await headers()).get("origin") ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "github", options: { redirectTo: `${origin}/auth/callback` } });
  if (error || !data.url) redirect("/auth/login?error=oauth");
  redirect(data.url);
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  if (supabase) await supabase.auth.signOut();
  redirect("/");
}
