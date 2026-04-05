import { kv } from '@vercel/kv';

/** In-memory fast-path: reject known over-limit IPs without a KV round-trip */
const localHits = new Map<string, { count: number; resetAt: number }>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
}

/**
 * Distributed rate limiter backed by Vercel KV.
 *
 * Uses fixed-window counting with KV INCR + TTL for persistence across
 * cold starts and instances. An in-memory map provides a fast-path reject
 * for repeat offenders (avoids KV call when already over limit).
 *
 * Falls back to in-memory-only if KV is unreachable.
 */
export async function checkRateLimit(
  routeKey: string,
  ip: string,
  maxHits: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const now = Date.now();
  const windowId = Math.floor(now / windowMs);
  const localKey = `${routeKey}:${ip}`;
  const kvKey = `rl:${routeKey}:${ip}:${windowId}`;

  // Clean up expired local entries
  for (const [k, v] of localHits) {
    if (now > v.resetAt) localHits.delete(k);
  }

  // Fast-path: if local map already shows over-limit, reject immediately
  const local = localHits.get(localKey);
  if (local && now <= local.resetAt && local.count >= maxHits) {
    return { allowed: false, remaining: 0 };
  }

  // Authoritative check via KV
  try {
    const count = await kv.incr(kvKey);

    // Set TTL on first hit (when count === 1)
    if (count === 1) {
      const ttlSeconds = Math.ceil(windowMs / 1000);
      await kv.expire(kvKey, ttlSeconds);
    }

    // Sync local map
    localHits.set(localKey, {
      count,
      resetAt: now + windowMs - (now % windowMs),
    });

    if (count > maxHits) {
      return { allowed: false, remaining: 0 };
    }

    return { allowed: true, remaining: maxHits - count };
  } catch (err) {
    console.error('[rate-limit] KV unavailable, falling back to memory:', err);
    return checkRateLimitLocal(localKey, maxHits, windowMs, now);
  }
}

/** Fallback: pure in-memory rate limiting (original behavior) */
function checkRateLimitLocal(
  key: string,
  maxHits: number,
  windowMs: number,
  now: number,
): RateLimitResult {
  const entry = localHits.get(key);

  if (!entry || now > entry.resetAt) {
    localHits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxHits - 1 };
  }

  if (entry.count >= maxHits) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: maxHits - entry.count };
}
