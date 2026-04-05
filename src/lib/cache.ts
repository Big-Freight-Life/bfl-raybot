import { kv } from '@vercel/kv';

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export class TTLCache<T> {
  private store = new Map<string, CacheEntry<T>>();
  private maxSize: number;

  constructor(maxSize = 500) {
    this.maxSize = maxSize;
  }

  get(key: string): T | undefined {
    const entry = this.store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this.store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs: number): void {
    if (!this.store.has(key) && this.store.size >= this.maxSize) {
      const oldest = this.store.keys().next().value;
      if (oldest !== undefined) this.store.delete(oldest);
    }
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs });
  }

  has(key: string): boolean {
    return this.get(key) !== undefined;
  }
}

export interface TieredGetOptions<T> {
  memCache: TTLCache<T>;
  memKey: string;
  memTtlMs: number;
  kvKey: string;
  kvTtlSeconds: number;
  fetcher: () => Promise<T>;
}

export type CacheTier = 'memory' | 'kv' | 'origin';

export interface TieredGetResult<T> {
  value: T;
  tier: CacheTier;
}

export async function tieredGet<T>(options: TieredGetOptions<T>): Promise<TieredGetResult<T>> {
  const { memCache, memKey, memTtlMs, kvKey, kvTtlSeconds, fetcher } = options;

  // Tier 1: Memory
  const memValue = memCache.get(memKey);
  if (memValue !== undefined) {
    console.debug(`[cache] ${kvKey} HIT memory`);
    return { value: memValue, tier: 'memory' };
  }

  // Tier 2: Vercel KV
  try {
    const kvValue = await kv.get<T>(kvKey);
    if (kvValue !== null && kvValue !== undefined) {
      console.debug(`[cache] ${kvKey} HIT kv`);
      memCache.set(memKey, kvValue, memTtlMs);
      return { value: kvValue, tier: 'kv' };
    }
  } catch (err) {
    console.error(`[cache] ${kvKey} KV read failed:`, err);
  }

  // Tier 3: Origin
  console.debug(`[cache] ${kvKey} MISS — fetching from origin`);
  const value = await fetcher();

  // Write back to both tiers
  memCache.set(memKey, value, memTtlMs);
  try {
    await kv.set(kvKey, value, { ex: kvTtlSeconds });
  } catch (err) {
    console.error(`[cache] ${kvKey} KV write failed:`, err);
  }

  return { value, tier: 'origin' };
}
