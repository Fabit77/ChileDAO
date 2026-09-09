const buckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(key: string, limit = 10, windowMs = 60_000) {
  const now = Date.now(); const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt < now) { buckets.set(key, { count: 1, resetAt: now + windowMs }); return; }
  if (bucket.count >= limit) throw new Error("RATE_LIMITED");
  bucket.count += 1;
}

export function assertSafeUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" && !(url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname))) throw new Error("UNSAFE_URL");
  return url.toString();
}
