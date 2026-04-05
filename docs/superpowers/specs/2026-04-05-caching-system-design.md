# Caching System Design

## Goal

Add industry-standard caching to the Raybot codebase: correct HTTP cache headers for static assets, and a two-tier server-side cache (in-memory + Vercel KV) for TTS audio and MX record lookups.

## Out of Scope

- Distributed rate limiting via KV (separate effort)
- Edge/CDN caching strategies (separate effort)
- Gemini response caching (conversational, unique per session)

---

## 1. Static Asset Cache Headers

Add `Cache-Control` headers in `next.config.ts` via the existing `headers()` function:

| Source pattern | Cache-Control value | Reasoning |
|----------------|-------------------|-----------|
| `/images/:path*` | `public, max-age=31536000, immutable` | Static images only change on redeploy |
| `/favicon.ico` | `public, max-age=86400` | 1 day — low cost, easy refresh |
| `/api/:path*` | `no-store` | Dynamic responses must never be cached |

Next.js already handles `/_next/static/*` (immutable) and `/_next/image/*` automatically. No fonts are self-hosted — Poppins falls through to system font stack.

---

## 2. Cache Utility Module

### `src/lib/cache.ts`

Two exports:

### `TTLCache<T>` class

In-memory TTL cache with bounded size.

- `get(key: string): T | undefined` — returns value if present and not expired, else undefined
- `set(key: string, value: T, ttlMs: number): void` — stores value with expiry timestamp
- `has(key: string): boolean` — checks presence and validity
- Lazy cleanup: expired entries removed on `get`/`has` access
- Constructor takes `maxSize: number` (default 500). When full, evicts the oldest entry (by insertion order) before inserting new one.
- No timers, no intervals, no background processes.

### `tieredGet<T>(options): Promise<{ value: T; tier: 'memory' | 'kv' | 'origin' }>`

Orchestrates the two-tier lookup:

```
options: {
  memCache: TTLCache<T>     // in-memory cache instance
  memKey: string             // key for memory cache
  memTtlMs: number           // TTL for memory tier
  kvKey: string              // key for Vercel KV
  kvTtlSeconds: number       // TTL for KV tier (KV uses seconds)
  fetcher: () => Promise<T>  // origin API call
}
```

Lookup order:
1. Check `memCache.get(memKey)` → hit? return `{ value, tier: 'memory' }`
2. Check `kv.get<T>(kvKey)` → hit? write to memCache, return `{ value, tier: 'kv' }`
3. Call `fetcher()` → write to KV with TTL, write to memCache, return `{ value, tier: 'origin' }`

KV errors are non-fatal: if KV read fails, proceed to fetcher. If KV write fails, log and continue. Cache should never break the request.

Fetcher errors propagate: if the origin API call fails (e.g., ElevenLabs is down, DNS times out), `tieredGet` does not catch it. The calling route handles the error as it does today.

---

## 3. TTS Caching

Applied in `src/app/api/tts/route.ts`.

- **Memory cache instance:** module-level `TTLCache<string>`, maxSize 200
- **Key generation:** SHA-256 hash of input text (after truncation to MAX_TTS_TEXT_LENGTH)
- **KV key:** `tts:<sha256hash>`
- **KV TTL:** 3600 seconds (1 hour)
- **Memory TTL:** 3600000 ms (1 hour)
- **Cached value:** base64-encoded audio string

Flow:
1. Validate request (existing middleware)
2. Extract and truncate text
3. Hash text to get cache key
4. Call `tieredGet` with fetcher that calls `textToSpeech()` and converts to base64
5. Return audio JSON with `X-Cache` and `X-Cache-Tier` headers

---

## 4. MX Record Caching

Applied in `src/app/api/verify-email/route.ts`.

- **Memory cache instance:** module-level `TTLCache<boolean>`, maxSize 500
- **Key generation:** email domain string (from `getEmailDomain()`)
- **KV key:** `mx:<domain>`
- **KV TTL:** 86400 seconds (24 hours)
- **Memory TTL:** 86400000 ms (24 hours)
- **Cached value:** `boolean` — true if domain has MX records, false if not

Flow:
1. Validate request and email format (existing checks)
2. Check blocked emails and disposable domains (existing checks — no cache needed, these are list lookups)
3. Extract domain
4. Call `tieredGet` with fetcher that does `dns.resolveMx(domain)` and returns `boolean`
5. If cached value is `false`, return error response (domain doesn't accept email)
6. Return success

---

## 5. Cache Observability

### Response headers (on TTS and verify-email routes):

- `X-Cache: HIT` or `X-Cache: MISS`
- `X-Cache-Tier: memory`, `kv`, or `origin` (indicates which level resolved the request)

### Console logging:

Debug-level logging from `tieredGet`:
- `[cache] <kvKey> HIT memory`
- `[cache] <kvKey> HIT kv`
- `[cache] <kvKey> MISS — fetching from origin`
- `[cache] <kvKey> KV write failed: <error>` (on non-fatal KV errors)

---

## 6. Testing

### Unit tests: `src/lib/__tests__/cache.test.ts`

**TTLCache:**
- `get`/`set` basic round-trip
- Expired entries return undefined
- `has` returns false for expired entries
- Max size eviction removes oldest entry
- Lazy cleanup on access

**tieredGet:**
- Memory hit: returns value, tier is 'memory', doesn't call KV or fetcher
- KV hit: returns value, tier is 'kv', writes to memory, doesn't call fetcher
- Full miss: calls fetcher, writes to both tiers, tier is 'origin'
- KV read error: falls through to fetcher (non-fatal)
- KV write error: logs error, still returns value (non-fatal)

### Route-level assertions:

**TTS route tests:**
- First request for text X returns `X-Cache: MISS`
- Second identical request returns `X-Cache: HIT`

**Verify-email route tests:**
- First MX lookup for domain returns `X-Cache: MISS`
- Second request for same domain returns `X-Cache: HIT`

---

## File Changes Summary

### New files:
- `src/lib/cache.ts`
- `src/lib/__tests__/cache.test.ts`

### Modified files:
- `next.config.ts` — add cache header rules
- `src/app/api/tts/route.ts` — integrate tieredGet for TTS caching
- `src/app/api/verify-email/route.ts` — integrate tieredGet for MX caching

### Constants to add in `src/lib/constants.ts`:
- `TTS_CACHE_TTL_MS = 3600000` (1 hour)
- `TTS_CACHE_TTL_SECONDS = 3600`
- `TTS_CACHE_MAX_SIZE = 200`
- `MX_CACHE_TTL_MS = 86400000` (24 hours)
- `MX_CACHE_TTL_SECONDS = 86400`
- `MX_CACHE_MAX_SIZE = 500`
