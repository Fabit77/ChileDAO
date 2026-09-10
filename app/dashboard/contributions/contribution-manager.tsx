"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Plus, X } from "lucide-react";
import { createContribution } from "@/app/actions";
export function ContributionManager() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  async function submit(formData: FormData) { setError(""); const result = await createContribution({ title: String(formData.get("title")), role: String(formData.get("role")), description: String(formData.get("description")), startDate: String(formData.get("startDate")), evidenceUrl: String(formData.get("evidence")) }); if (result.ok) { setOpen(false); router.refresh(); } else setError(result.error); }
  return <>{open && <div className="modal-backdrop"><div className="modal"><button className="modal-close" type="button" onClick={() => setOpen(false)} aria-label="Cerrar"><X /></button><span className="eyebrow">Proof of work</span><h2>Registrar contribution</h2><p>Describe el trabajo y agrega evidencia. Comenzará como declaración propia.</p><form action={submit} className="stack-form"><label>Título<input name="title" required maxLength={100} placeholder="Ej. Taller de Solidity para estudiantes" /></label><label>Tu rol<input name="role" required maxLength={80} placeholder="Ej. Facilitadora técnica" /></label><label>Fecha de inicio<input name="startDate" required type="date" /></label><label>Descripción<textarea name="description" required minLength={20} maxLength={800} placeholder="Qué hiciste, para quién y qué resultado tuvo..." /></label><label>URL de evidencia<input name="evidence" required type="url" placeholder="https://github.com/..." /></label><div className="info-inline"><Check size={14} /> Nadie puede marcarla como verificada sin un registro de validation.</div>{error && <p className="form-error">{error}</p>}<button className="button button-primary full-button">Guardar contribution</button></form></div></div>}<button className="button button-primary" type="button" onClick={() => setOpen(true)}><Plus size={16} /> Nueva contribution</button></>;
}
