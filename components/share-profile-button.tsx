"use client";

import { useState } from "react";
import { Check, Share2 } from "lucide-react";

export function ShareProfileButton() {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }

  return <button className="icon-button" type="button" onClick={copyLink} aria-label="Copiar enlace del perfil" title="Copiar enlace del perfil">{copied ? <Check size={18} /> : <Share2 size={18} />}</button>;
}
