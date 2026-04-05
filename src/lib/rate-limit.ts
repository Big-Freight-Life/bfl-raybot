const ipHits = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(routeKey: string, ip: string, maxHits: number, windowMs: number): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const key = `${routeKey}:${ip}`;
  const entry = ipHits.get(key);

  // Cleanup expired entries
  for (const [k, v] of ipHits) {
    if (now > v.resetAt) {
      ipHits.delete(k);
    }
  }

  if (!entry || now > entry.resetAt) {
    ipHits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxHits - 1 };
  }

  if (entry.count >= maxHits) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxHits - entry.count };
}
