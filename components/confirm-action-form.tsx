"use client";

import type { FormEvent, ReactNode } from "react";

export function ConfirmActionForm({ action, message, children, className }: { action: (formData: FormData) => void | Promise<void>; message: string; children: ReactNode; className?: string }) {
  function confirmSubmit(event: FormEvent<HTMLFormElement>) {
    if (!window.confirm(message)) event.preventDefault();
  }

  return <form action={action} className={className} onSubmit={confirmSubmit}>{children}</form>;
}
