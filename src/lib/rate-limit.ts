const ipHits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(ip: string, maxHits: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = ipHits.get(ip);

  if (!entry || now > entry.resetAt) {
    ipHits.set(ip, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxHits - 1 };
  }

  if (entry.count >= maxHits) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxHits - entry.count };
}
