# Caching System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add industry-standard caching — HTTP cache headers for static assets and a two-tier (in-memory + Vercel KV) server-side cache for TTS audio and MX record lookups.

**Architecture:** A generic `TTLCache` class provides bounded in-memory caching. A `tieredGet` orchestrator checks memory first, then Vercel KV, then calls the origin API — writing back to both tiers on miss. TTS and MX routes use this to avoid redundant external calls.

**Tech Stack:** Next.js 16, Vercel KV (`@vercel/kv`), Node.js `crypto` (for SHA-256 hashing), Vitest

---

## File Structure

| File | Responsibility |
|------|---------------|
| `src/lib/cache.ts` | `TTLCache<T>` class + `tieredGet<T>` orchestrator |
| `src/lib/__tests__/cache.test.ts` | Unit tests for TTLCache and tieredGet |
| `src/lib/constants.ts` | New cache TTL/size constants (append to existing) |
| `next.config.ts` | Static asset Cache-Control headers |
| `src/app/api/tts/route.ts` | Integrate tieredGet for TTS caching |
| `src/app/api/verify-email/route.ts` | Integrate tieredGet for MX caching |

---

### Task 1: Add cache constants

**Files:**
- Modify: `src/lib/constants.ts`

- [ ] **Step 1: Add cache constants to end of file**

Append to `src/lib/constants.ts`:

```typescript
// ─── Cache: TTS ───
export const TTS_CACHE_TTL_MS = 3_600_000; // 1 hour
export const TTS_CACHE_TTL_SECONDS = 3_600;
export const TTS_CACHE_MAX_SIZE = 200;

// ─── Cache: MX Records ───
export const MX_CACHE_TTL_MS = 86_400_000; // 24 hours
export const MX_CACHE_TTL_SECONDS = 86_400;
export const MX_CACHE_MAX_SIZE = 500;
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/lib/constants.ts
git commit -m "Add cache TTL and size constants for TTS and MX"
```

---

### Task 2: Write TTLCache failing tests

**Files:**
- Create: `src/lib/__tests__/cache.test.ts`

- [ ] **Step 1: Write TTLCache unit tests**

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('TTLCache', () => {
  // We'll import after creating the module in Task 3
  let TTLCache: typeof import('../cache').TTLCache;

  beforeEach(async () => {
    const mod = await import('../cache');
    TTLCache = mod.TTLCache;
  });

  it('stores and retrieves a value', () => {
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 60_000);
    expect(cache.get('key1')).toBe('value1');
  });

  it('returns undefined for missing keys', () => {
    const cache = new TTLCache<string>(10);
    expect(cache.get('missing')).toBeUndefined();
  });

  it('returns undefined for expired entries', () => {
    vi.useFakeTimers();
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 100);
    vi.advanceTimersByTime(101);
    expect(cache.get('key1')).toBeUndefined();
    vi.useRealTimers();
  });

  it('has() returns false for expired entries', () => {
    vi.useFakeTimers();
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 100);
    vi.advanceTimersByTime(101);
    expect(cache.has('key1')).toBe(false);
    vi.useRealTimers();
  });

  it('has() returns true for valid entries', () => {
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 60_000);
    expect(cache.has('key1')).toBe(true);
  });

  it('evicts oldest entry when maxSize is reached', () => {
    const cache = new TTLCache<string>(2);
    cache.set('a', '1', 60_000);
    cache.set('b', '2', 60_000);
    cache.set('c', '3', 60_000); // should evict 'a'
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe('2');
    expect(cache.get('c')).toBe('3');
  });

  it('cleans up expired entries on access', () => {
    vi.useFakeTimers();
    const cache = new TTLCache<string>(10);
    cache.set('old', 'stale', 100);
    cache.set('new', 'fresh', 60_000);
    vi.advanceTimersByTime(101);
    // Accessing 'old' should clean it up
    expect(cache.get('old')).toBeUndefined();
    // 'new' should still be there
    expect(cache.get('new')).toBe('fresh');
    vi.useRealTimers();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/lib/__tests__/cache.test.ts`
Expected: FAIL — module `../cache` does not exist

---

### Task 3: Implement TTLCache

**Files:**
- Create: `src/lib/cache.ts`

- [ ] **Step 1: Implement TTLCache class**

```typescript
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
    // Evict oldest if at capacity
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
```

- [ ] **Step 2: Run TTLCache tests**

Run: `npx vitest run src/lib/__tests__/cache.test.ts`
Expected: All 7 TTLCache tests PASS

- [ ] **Step 3: Commit**

```bash
git add src/lib/cache.ts src/lib/__tests__/cache.test.ts
git commit -m "Add TTLCache in-memory cache with TTL and bounded size"
```

---

### Task 4: Write tieredGet failing tests

**Files:**
- Modify: `src/lib/__tests__/cache.test.ts`

- [ ] **Step 1: Add tieredGet tests to cache.test.ts**

Append to the file, after the TTLCache describe block:

```typescript
// Mock @vercel/kv
vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

import { kv } from '@vercel/kv';

const mockedKv = kv as unknown as {
  get: ReturnType<typeof vi.fn>;
  set: ReturnType<typeof vi.fn>;
};

describe('tieredGet', () => {
  let TTLCache: typeof import('../cache').TTLCache;
  let tieredGet: typeof import('../cache').tieredGet;

  beforeEach(async () => {
    vi.resetModules();
    mockedKv.get.mockReset();
    mockedKv.set.mockReset();
    const mod = await import('../cache');
    TTLCache = mod.TTLCache;
    tieredGet = mod.tieredGet;
  });

  it('returns from memory on memory hit', async () => {
    const mem = new TTLCache<string>(10);
    mem.set('k', 'from-memory', 60_000);
    const fetcher = vi.fn();

    const result = await tieredGet({
      memCache: mem,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'from-memory', tier: 'memory' });
    expect(mockedKv.get).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('returns from KV on KV hit and writes to memory', async () => {
    const mem = new TTLCache<string>(10);
    mockedKv.get.mockResolvedValue('from-kv');
    const fetcher = vi.fn();

    const result = await tieredGet({
      memCache: mem,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'from-kv', tier: 'kv' });
    expect(mem.get('k')).toBe('from-kv');
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('calls fetcher on full miss and writes to both tiers', async () => {
    const mem = new TTLCache<string>(10);
    mockedKv.get.mockResolvedValue(null);
    mockedKv.set.mockResolvedValue('OK');
    const fetcher = vi.fn().mockResolvedValue('from-origin');

    const result = await tieredGet({
      memCache: mem,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'from-origin', tier: 'origin' });
    expect(mem.get('k')).toBe('from-origin');
    expect(mockedKv.set).toHaveBeenCalledWith('kv:k', 'from-origin', { ex: 60 });
  });

  it('falls through to fetcher on KV read error', async () => {
    const mem = new TTLCache<string>(10);
    mockedKv.get.mockRejectedValue(new Error('KV down'));
    mockedKv.set.mockResolvedValue('OK');
    const fetcher = vi.fn().mockResolvedValue('from-origin');

    const result = await tieredGet({
      memCache: mem,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'from-origin', tier: 'origin' });
  });

  it('returns value even if KV write fails', async () => {
    const mem = new TTLCache<string>(10);
    mockedKv.get.mockResolvedValue(null);
    mockedKv.set.mockRejectedValue(new Error('KV write failed'));
    const fetcher = vi.fn().mockResolvedValue('from-origin');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await tieredGet({
      memCache: mem,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'from-origin', tier: 'origin' });
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
```

- [ ] **Step 2: Run tests to verify tieredGet tests fail**

Run: `npx vitest run src/lib/__tests__/cache.test.ts`
Expected: TTLCache tests PASS, tieredGet tests FAIL (tieredGet not exported)

---

### Task 5: Implement tieredGet

**Files:**
- Modify: `src/lib/cache.ts`

- [ ] **Step 1: Add tieredGet function to cache.ts**

Append to `src/lib/cache.ts` after the TTLCache class:

```typescript
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
```

- [ ] **Step 2: Run all cache tests**

Run: `npx vitest run src/lib/__tests__/cache.test.ts`
Expected: All 12 tests PASS (7 TTLCache + 5 tieredGet)

- [ ] **Step 3: Commit**

```bash
git add src/lib/cache.ts src/lib/__tests__/cache.test.ts
git commit -m "Add tieredGet two-tier cache orchestrator (memory + KV)"
```

---

### Task 6: Add static asset cache headers

**Files:**
- Modify: `next.config.ts`

- [ ] **Step 1: Add cache header rules to next.config.ts**

Replace the `headers()` function body to include cache rules before the catch-all security headers:

```typescript
const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/images/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/favicon.ico",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
      {
        source: "/api/:path*",
        headers: [
          ...securityHeaders,
          { key: "Cache-Control", value: "no-store" },
        ],
      },
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add next.config.ts
git commit -m "Add Cache-Control headers for static assets and API routes"
```

---

### Task 7: Integrate TTS caching

**Files:**
- Modify: `src/app/api/tts/route.ts`

- [ ] **Step 1: Rewrite TTS route with tieredGet**

Replace `src/app/api/tts/route.ts` with:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { textToSpeech } from '@/lib/elevenlabs';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import { TTLCache, tieredGet } from '@/lib/cache';
import {
  RATE_LIMIT_TTS,
  MAX_TTS_TEXT_LENGTH,
  TTS_CACHE_TTL_MS,
  TTS_CACHE_TTL_SECONDS,
  TTS_CACHE_MAX_SIZE,
} from '@/lib/constants';

const ttsCache = new TTLCache<string>(TTS_CACHE_MAX_SIZE);

function hashText(text: string): string {
  return createHash('sha256').update(text).digest('hex');
}

export async function POST(request: NextRequest) {
  const result = validateRequest(request, {
    routeKey: 'tts',
    ...RATE_LIMIT_TTS,
  });
  if (isErrorResponse(result)) return result;

  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const truncated = text.slice(0, MAX_TTS_TEXT_LENGTH);
    const hash = hashText(truncated);

    const { value: base64, tier } = await tieredGet({
      memCache: ttsCache,
      memKey: hash,
      memTtlMs: TTS_CACHE_TTL_MS,
      kvKey: `tts:${hash}`,
      kvTtlSeconds: TTS_CACHE_TTL_SECONDS,
      fetcher: async () => {
        const audioBuffer = await textToSpeech(truncated);
        return Buffer.from(audioBuffer).toString('base64');
      },
    });

    return NextResponse.json(
      { audio: base64 },
      {
        headers: {
          'X-Cache': tier === 'origin' ? 'MISS' : 'HIT',
          'X-Cache-Tier': tier,
        },
      },
    );
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Voice unavailable' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/tts/route.ts
git commit -m "Integrate two-tier cache for TTS audio responses"
```

---

### Task 8: Integrate MX record caching

**Files:**
- Modify: `src/app/api/verify-email/route.ts`

- [ ] **Step 1: Rewrite verify-email route with tieredGet**

Replace `src/app/api/verify-email/route.ts` with:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import { RATE_LIMIT_VERIFY_EMAIL, MX_CACHE_TTL_MS, MX_CACHE_TTL_SECONDS, MX_CACHE_MAX_SIZE } from '@/lib/constants';
import { isValidEmailFormat, isBlockedEmail, isDisposableDomain, getEmailDomain } from '@/lib/validators';
import { TTLCache, tieredGet } from '@/lib/cache';

const mxCache = new TTLCache<boolean>(MX_CACHE_MAX_SIZE);

export async function POST(request: NextRequest) {
  const result = validateRequest(request, {
    routeKey: 'verify-email',
    ...RATE_LIMIT_VERIFY_EMAIL,
  });
  if (isErrorResponse(result)) return result;

  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();

    if (!isValidEmailFormat(trimmed)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    if (isBlockedEmail(trimmed)) {
      return NextResponse.json({ error: 'Please use a real email address' }, { status: 400 });
    }

    if (isDisposableDomain(trimmed)) {
      return NextResponse.json({ error: 'Disposable email addresses are not allowed' }, { status: 400 });
    }

    const domain = getEmailDomain(trimmed);

    // MX record check with two-tier cache
    try {
      const { value: hasMx, tier } = await tieredGet({
        memCache: mxCache,
        memKey: domain,
        memTtlMs: MX_CACHE_TTL_MS,
        kvKey: `mx:${domain}`,
        kvTtlSeconds: MX_CACHE_TTL_SECONDS,
        fetcher: async () => {
          const records = await dns.resolveMx(domain);
          return Array.isArray(records) && records.length > 0;
        },
      });

      if (!hasMx) {
        return NextResponse.json(
          { error: 'This email domain doesn\u2019t appear to accept email' },
          { status: 400, headers: { 'X-Cache': tier === 'origin' ? 'MISS' : 'HIT', 'X-Cache-Tier': tier } },
        );
      }

      return NextResponse.json(
        { success: true },
        { headers: { 'X-Cache': tier === 'origin' ? 'MISS' : 'HIT', 'X-Cache-Tier': tier } },
      );
    } catch {
      return NextResponse.json({ error: 'Could not verify this email domain' }, { status: 400 });
    }
  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
```

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/app/api/verify-email/route.ts
git commit -m "Integrate two-tier cache for MX record lookups"
```

---

### Task 9: Run full test suite

**Files:** None (verification only)

- [ ] **Step 1: Run all tests**

Run: `npx vitest run`
Expected: All tests pass (existing 77 + new 12 cache tests = 89 total)

- [ ] **Step 2: Run typecheck**

Run: `npx tsc --noEmit`
Expected: No errors

- [ ] **Step 3: Final commit if any outstanding changes**

```bash
git status
# If clean, nothing to do. If changes found, stage and commit.
```
