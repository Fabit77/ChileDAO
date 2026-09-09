"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Github, ShieldCheck } from "lucide-react";

type Profile = { name: string; username: string; headline: string; location: string; bio: string };

export function JoinFlow() {
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState<Profile>({ name: "", username: "", headline: "", location: "Santiago, Chile", bio: "" });
  const update = (key: keyof Profile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  const next = () => { if (step === 2) localStorage.setItem("chiledao_profile", JSON.stringify(profile)); setStep((value) => Math.min(3, value + 1)); };

  return <div className="join-shell">
    <div className="join-progress"><span>Paso {step} de 3</span><div>{[1, 2, 3].map((item) => <i key={item} className={item <= step ? "active" : ""} />)}</div></div>
    {step === 1 && <section className="join-card"><span className="join-icon"><ShieldCheck /></span><span className="eyebrow">Tu identidad, sin fricción</span><h1>Comienza con una cuenta.</h1><p>Usa una identidad que la comunidad pueda reconocer. Tu email nunca será público y la wallet es opcional.</p><button className="auth-button" onClick={next}><Github size={19} /> Continuar con GitHub <ArrowRight size={17} /></button><button className="auth-button subtle" onClick={next}>Continuar con Google <ArrowRight size={17} /></button><small>Modo demo: no se enviarán datos a un proveedor externo.</small></section>}
    {step === 2 && <section className="join-card join-form"><span className="eyebrow">Perfil público</span><h1>¿Cómo te conoce la comunidad?</h1><p>Esta información será visible. Podrás editarla después.</p><div className="form-grid"><label>Nombre visible<input required value={profile.name} onChange={(e) => update("name", e.target.value)} placeholder="Ej. Martina Sáez" /></label><label>Username<div className="input-prefix"><span>@</span><input required value={profile.username} onChange={(e) => update("username", e.target.value.replace(/[^a-z0-9_-]/gi, "").toLowerCase())} placeholder="martinasaez" /></div></label><label className="full">¿Qué haces?<input value={profile.headline} onChange={(e) => update("headline", e.target.value)} placeholder="Frontend developer · Web3 builder" /></label><label className="full">Ubicación<input value={profile.location} onChange={(e) => update("location", e.target.value)} /></label><label className="full">Bio<textarea maxLength={500} value={profile.bio} onChange={(e) => update("bio", e.target.value)} placeholder="Cuenta brevemente qué construyes y qué te interesa..." /><small>{profile.bio.length}/500</small></label></div><div className="join-actions"><button className="button button-secondary" onClick={() => setStep(1)}><ArrowLeft size={16} /> Atrás</button><button className="button button-primary" disabled={!profile.name || !profile.username} onClick={next}>Crear perfil <ArrowRight size={16} /></button></div></section>}
    {step === 3 && <section className="join-card join-success"><span className="success-mark"><Check /></span><span className="eyebrow">Perfil creado</span><h1>Ahora necesitas<br />5 personas.</h1><p>Ya eres Candidate. Comparte tu enlace con miembros que realmente te conozcan. Cada vouch solo confirma tu vínculo con el ecosistema.</p><div className="progress-preview"><div><b>0</b><span>/ 5 vouches</span></div><div className="progress-track"><i /></div></div><Link className="button button-primary" href="/dashboard">Ir a mi dashboard <ArrowRight size={16} /></Link></section>}
  </div>;
}
