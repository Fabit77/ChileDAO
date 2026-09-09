"use server";

import { randomBytes } from "node:crypto";
import { z } from "zod";
import { canVouch } from "@/lib/domain/membership";
import { requireUser } from "@/lib/auth/session";
import { assertSafeUrl, checkRateLimit } from "@/lib/security";
import { persistMembershipVouch, persistVouchRevocation } from "@/lib/data/vouches";
import { persistContribution, persistContributionValidation, persistEndorsement, persistValidationRequest, persistWallet } from "@/lib/data/reputation";

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };
const id = z.string().min(1).max(80);

export async function requestVouch(candidateId: string): Promise<ActionResult<{ token: string }>> {
  const user = await requireUser(); checkRateLimit(`request-vouch:${user.id}`, 5);
  const parsed = id.safeParse(candidateId); if (!parsed.success || user.id !== candidateId) return { ok: false, error: "Solicitud inválida." };
  return { ok: true, data: { token: randomBytes(24).toString("base64url") } };
}

export async function createVouch(input: unknown): Promise<ActionResult> {
  const user = await requireUser(); checkRateLimit(`vouch:${user.id}`, 10);
  if (!canVouch(user.role)) return { ok: false, error: "Solo miembros pueden emitir vouches." };
  const parsed = z.object({ candidateId: id, relationship: z.enum(["worked_together", "event", "community", "hackathon", "friend", "education", "other"]), isPublic: z.boolean() }).safeParse(input);
  if (!parsed.success || parsed.data.candidateId === user.id) return { ok: false, error: "Vouch inválido." };
  if (process.env.DATABASE_URL) await persistMembershipVouch({ ...parsed.data, validatorId: user.id });
  return { ok: true };
}

export async function revokeVouch(vouchId: string): Promise<ActionResult> {
  const user = await requireUser(); checkRateLimit(`revoke:${user.id}`); if (!id.safeParse(vouchId).success) return { ok: false, error: "Vouch inválido." }; if (process.env.DATABASE_URL) await persistVouchRevocation(vouchId, user.id); return { ok: true };
}

export async function createContribution(input: unknown): Promise<ActionResult<{ status: "SELF_CLAIMED" }>> {
  const user = await requireUser(); checkRateLimit(`contribution:${user.id}`, 8);
  const parsed = z.object({ title: z.string().trim().min(3).max(100), description: z.string().trim().min(20).max(800), role: z.string().trim().min(2).max(80), startDate: z.coerce.date(), evidenceUrl: z.string().url().transform(assertSafeUrl) }).safeParse(input);
  if (!parsed.success) return { ok: false, error: "Revisa los datos y la evidencia." };
  if (process.env.DATABASE_URL) await persistContribution(user.id, parsed.data);
  return { ok: true, data: { status: "SELF_CLAIMED" } };
}

export async function requestContributionValidation(contributionId: string, validatorId: string): Promise<ActionResult> {
  const user = await requireUser(); checkRateLimit(`request-work:${user.id}`, 10); if (!id.safeParse(contributionId).success || !id.safeParse(validatorId).success) return { ok: false, error: "Solicitud inválida." }; if (process.env.DATABASE_URL) await persistValidationRequest(user.id, contributionId, validatorId); return { ok: true };
}

export async function validateContribution(input: unknown): Promise<ActionResult> {
  const user = await requireUser(); if (!canVouch(user.role)) return { ok: false, error: "No autorizado." };
  const parsed = z.object({ contributionId: id, decision: z.enum(["VERIFIED", "REJECTED", "CHANGES_REQUESTED"]), comment: z.string().trim().max(500).optional() }).safeParse(input); if (!parsed.success) return { ok: false, error: "Respuesta inválida." }; if (process.env.DATABASE_URL) await persistContributionValidation(user.id, parsed.data); return { ok: true };
}

export async function createEndorsement(input: unknown): Promise<ActionResult> {
  const user = await requireUser(); if (!canVouch(user.role)) return { ok: false, error: "No autorizado." };
  const parsed = z.object({ recipientId: id, skillId: id, contributionId: id.optional(), comment: z.string().trim().max(280).optional() }).safeParse(input); if (!parsed.success || parsed.data.recipientId === user.id) return { ok: false, error: "Endorsement inválido." }; if (process.env.DATABASE_URL) await persistEndorsement(user.id, parsed.data); return { ok: true };
}

export async function connectWallet(address: string): Promise<ActionResult> {
  const user = await requireUser(); checkRateLimit(`wallet:${user.id}`, 3); if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return { ok: false, error: "Dirección EVM inválida." }; if (process.env.DATABASE_URL) await persistWallet(user.id, address); return { ok: true };
}
