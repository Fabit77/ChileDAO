"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CopyVouchLink({ candidateId }: { candidateId: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(`${window.location.origin}/vouch/${candidateId}`);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }
  return <button className="button button-primary" type="button" onClick={copy}>{copied ? <Check size={16} /> : <Copy size={16} />}{copied ? "Enlace copiado" : "Copiar enlace de vouch"}</button>;
}
