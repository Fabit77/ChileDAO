"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, LockKeyhole, ShieldCheck, X } from "lucide-react";
import { createVouch } from "@/app/actions";

export function VouchPanel({ candidateId, candidate }: { candidateId: string; candidate: string }) {
  const [decision, setDecision] = useState<"idle" | "confirmed" | "declined" | "error">("idle");
  async function submit(formData: FormData) {
    const result = await createVouch({ candidateId, relationship: String(formData.get("relationship")), isPublic: formData.get("isPublic") === "on" });
    setDecision(result.ok ? "confirmed" : "error");
  }
  if (decision !== "idle") return <div className="vouch-decision"><span className={decision === "confirmed" ? "success-mark" : "decline-mark"}>{decision === "confirmed" ? <Check /> : <X />}</span><h2>{decision === "confirmed" ? "Vouch registrado" : decision === "declined" ? "Solicitud cerrada" : "No se pudo registrar"}</h2><p>{decision === "confirmed" ? `Confirmaste que conoces a ${candidate}. Esto no creó ningún endorsement profesional.` : decision === "error" ? "Debes ingresar con una cuenta de miembro elegible y no puedes validarte a ti mismo." : "No se registró ningún vouch ni cambió el progreso de la persona."}</p><Link className="button button-primary" href="/dashboard/requests">Volver a solicitudes</Link></div>;
  return <div className="vouch-action"><form action={submit}><label>¿Cómo le conoces? <span>Privado</span><select name="relationship" defaultValue="community"><option value="worked_together">Trabajamos juntos</option><option value="event">Evento</option><option value="community">Comunidad</option><option value="hackathon">Hackathon</option><option value="friend">Amistad</option><option value="education">Educación</option><option value="other">Otro</option></select></label><label className="checkbox"><input name="isPublic" type="checkbox" defaultChecked /><span>Mostrar públicamente que di este vouch</span></label><button className="button button-primary full-button" type="submit"><ShieldCheck size={17} /> Sí, le conozco</button></form><button className="decline-button" onClick={() => setDecision("declined")}>No puedo validar</button><p className="privacy-note"><LockKeyhole size={13} /> La razón de la relación permanece privada.</p></div>;
}
