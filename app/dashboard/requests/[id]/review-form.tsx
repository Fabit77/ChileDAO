"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { validateContribution } from "@/app/actions";

export function ReviewForm({ contributionId }: { contributionId: string }) {
  const router = useRouter();
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setError("");
    const result = await validateContribution({ contributionId, decision: formData.get("decision"), comment: String(formData.get("comment") ?? "") });
    if (!result.ok) return setError(result.error);
    router.push("/dashboard/requests");
    router.refresh();
  }
  return <form action={submit} className="stack-form"><label>Decisión<select name="decision" required defaultValue=""><option value="" disabled>Selecciona una respuesta</option><option value="VERIFIED">Verificar contribution</option><option value="CHANGES_REQUESTED">Solicitar cambios</option><option value="REJECTED">Rechazar</option></select></label><label>Comentario opcional<textarea name="comment" maxLength={500} placeholder="Agrega contexto para la persona que solicitó la validación." /></label>{error && <p className="form-error">{error}</p>}<button className="button button-primary" type="submit">Enviar respuesta</button></form>;
}
