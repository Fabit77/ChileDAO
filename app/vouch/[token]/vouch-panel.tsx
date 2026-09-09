"use client";
import { useState } from "react";
import Link from "next/link";
import { Check, LockKeyhole, ShieldCheck, X } from "lucide-react";

export function VouchPanel({ candidate }: { candidate: string }) {
  const [decision, setDecision] = useState<"idle" | "confirmed" | "declined">("idle");
  if (decision !== "idle") return <div className="vouch-decision"><span className={decision === "confirmed" ? "success-mark" : "decline-mark"}>{decision === "confirmed" ? <Check /> : <X />}</span><h2>{decision === "confirmed" ? "Vouch registrado" : "Solicitud cerrada"}</h2><p>{decision === "confirmed" ? `Confirmaste que conoces a ${candidate}. Esto no creó ningún endorsement profesional.` : "No se registró ningún vouch ni cambió el progreso de la persona."}</p><Link className="button button-primary" href="/dashboard/requests">Volver a solicitudes</Link></div>;
  return <div className="vouch-action"><label>¿Cómo la conoces? <span>Privado</span><select defaultValue="community"><option value="worked_together">Trabajamos juntos</option><option value="event">Evento</option><option value="community">Comunidad</option><option value="hackathon">Hackathon</option><option value="friend">Amistad</option><option value="education">Educación</option><option value="other">Otro</option></select></label><label className="checkbox"><input type="checkbox" defaultChecked /><span>Mostrar públicamente que di este vouch</span></label><button className="button button-primary full-button" onClick={() => setDecision("confirmed")}><ShieldCheck size={17} /> Sí, la conozco</button><button className="decline-button" onClick={() => setDecision("declined")}>No puedo validar</button><p className="privacy-note"><LockKeyhole size={13} /> La razón de la relación permanece privada.</p></div>;
}
