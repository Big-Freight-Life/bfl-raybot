# Gemini Response Caching Design

## Overview

Two optimizations to reduce redundant Gemini API calls and initialization overhead:
1. Module-level model instance caching
2. Semantic dedup cache for identical recent questions

## 1. Model Instance Caching

### Current behavior
`createModel()` instantiates `GoogleGenerativeAI` and calls `getGenerativeModel()` on every request, even though the model config (model name, system prompt, generation config) is static.

### Change
Move model creation to a module-level singleton. The instance is reused across requests within the same serverless instance lifecycle. No external cache needed — this is pure in-memory optimization.

```typescript
let cachedModel: GenerativeModel | null = null;

function getModel(): GenerativeModel {
  if (!cachedModel) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');
    const genAI = new GoogleGenerativeAI(apiKey);
    cachedModel = genAI.getGenerativeModel({ ... });
  }
  return cachedModel;
}
```

## 2. Semantic Dedup Cache

### Purpose
Catch duplicate requests caused by double-submits, page refreshes, or users re-asking the same question within a short window. Not intended as a general response cache.

### Cache key
SHA-256 hash of JSON-stringified object containing:
- Last user message text
- Last 2 model response texts from history (if present)

This provides enough conversational context to avoid returning a cached response in a different conversation, while still catching true duplicates.

### Cache parameters
- **Key pattern:** `chat-dedup:{sha256hash}`
- **Memory TTL:** 5 minutes
- **KV TTL:** 5 minutes (300 seconds)
- **Max memory entries:** 200
- Uses existing `tieredGet` two-tier cache system

### Behavior

**On cache hit:**
- Return cached response as plain text (non-streamed)
- Set `X-Cache: HIT` header
- Still log the conversation to KV (for analytics continuity)

**On cache miss:**
- Stream from Gemini as usual
- After stream completes, write full response to dedup cache
- Set `X-Cache: MISS` header

### Request flow
```
Request → rate limit → dedup cache check
  ├── HIT  → return cached text response (non-streamed)
  └── MISS → stream from Gemini → write to dedup cache → return stream
```

## Files changed

| File | Change |
|------|--------|
| `src/lib/gemini.ts` | Singleton model instance |
| `src/app/api/chat/route.ts` | Dedup check before streaming, cache write after stream |
| `src/lib/constants.ts` | `CHAT_DEDUP_*` constants |
| `src/lib/__tests__/gemini.test.ts` | Singleton behavior test |

## What stays the same
- Streaming behavior on cache miss
- Chat logging (even on cache hits)
- Rate limiting (enforced before cache check)
- System prompt content
- Message sanitization and validation
