export const USERNAME_CHANGE_COOLDOWN_MS = 24 * 60 * 60 * 1000;

const RESERVED_USERNAMES = new Set([
  "admin", "administrador", "api", "auth", "chile", "chiledao", "moderador",
  "moderator", "oficial", "official", "root", "seguridad", "security",
  "sistema", "soporte", "staff", "support", "system", "undefined", "null",
]);

export function normalizeUsername(value: string) {
  return value.trim().replace(/^@+/, "").toLowerCase();
}

export function isReservedUsername(value: string) {
  return RESERVED_USERNAMES.has(normalizeUsername(value));
}

export function nextUsernameChangeAt(lastChangedAt: Date | null, now = new Date()) {
  if (!lastChangedAt) return null;
  const next = new Date(lastChangedAt.getTime() + USERNAME_CHANGE_COOLDOWN_MS);
  return next > now ? next : null;
}
