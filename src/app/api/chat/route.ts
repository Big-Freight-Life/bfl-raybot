import { NextRequest, NextResponse } from 'next/server';
import { createHash } from 'crypto';
import { kv } from '@vercel/kv';
import { streamChatResponse } from '@/lib/gemini';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import {
  RATE_LIMIT_CHAT,
  MAX_MESSAGES_HISTORY,
  CHAT_DEDUP_TTL_MS,
  CHAT_DEDUP_TTL_SECONDS,
  CHAT_DEDUP_MAX_SIZE,
} from '@/lib/constants';
import { sanitizeMessage } from '@/lib/sanitization';
import { validateSessionId } from '@/lib/validators';
import { ChatMessage } from '@/lib/knowledge';
import { logMessage } from '@/lib/chat-logger';
import { TTLCache } from '@/lib/cache';

const dedupCache = new TTLCache<string>(CHAT_DEDUP_MAX_SIZE);

/** Build a dedup key from the last user message + last 2 model responses */
function buildDedupHash(messages: ChatMessage[]): string {
  const lastUser = messages[messages.length - 1]?.content ?? '';
  const modelResponses = messages
    .filter((m) => m.role === 'model')
    .slice(-2)
    .map((m) => m.content);
  const payload = JSON.stringify({ q: lastUser, ctx: modelResponses });
  return createHash('sha256').update(payload).digest('hex');
}

export async function POST(request: NextRequest) {
  const result = await validateRequest(request, {
    routeKey: 'chat',
    ...RATE_LIMIT_CHAT,
  });
  if (isErrorResponse(result)) return result;
  const { ip, remaining } = result;

  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages ?? [];
    const rawSessionId = body.sessionId;
    const sessionId: string = validateSessionId(rawSessionId) ? rawSessionId : 'unknown';
    const rawAwContext = typeof body.awContext === 'string' ? body.awContext : null;
    const awContext = rawAwContext ? sanitizeMessage(rawAwContext).slice(0, 600) : null;

    if (!messages.length || !messages[messages.length - 1]?.content) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Sanitize ALL messages
    const sanitized = messages.map((m) => ({ ...m, content: sanitizeMessage(m.content) }));
    const userMessage = sanitized[sanitized.length - 1].content;

    let trimmed = sanitized.slice(-MAX_MESSAGES_HISTORY);
    if (awContext) {
      // Inject AW score context as a model turn at the start so Gemini sees it as known background
      trimmed = [
        { role: 'user', content: `[Background] ${awContext}` },
        { role: 'model', content: 'Got it — I\'ll keep your AW Score in mind as we talk.' },
        ...trimmed,
      ];
    }

    // Dedup check: return cached response for identical recent questions
    const dedupHash = buildDedupHash(trimmed);
    const kvKey = `chat-dedup:${dedupHash}`;

    // Tier 1: Memory
    const memCached = dedupCache.get(dedupHash);
    if (memCached) {
      logMessage(sessionId, ip, userMessage, memCached).catch(() => {});
      return new Response(memCached, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'X-RateLimit-Remaining': String(remaining),
          'X-Cache': 'HIT',
          'X-Cache-Tier': 'memory',
        },
      });
    }

    // Tier 2: KV
    try {
      const kvCached = await kv.get<string>(kvKey);
      if (kvCached) {
        dedupCache.set(dedupHash, kvCached, CHAT_DEDUP_TTL_MS);
        logMessage(sessionId, ip, userMessage, kvCached).catch(() => {});
        return new Response(kvCached, {
          headers: {
            'Content-Type': 'text/plain; charset=utf-8',
            'X-RateLimit-Remaining': String(remaining),
            'X-Cache': 'HIT',
            'X-Cache-Tier': 'kv',
          },
        });
      }
    } catch {
      // KV read failed — proceed to Gemini
    }

    // Cache miss — stream from Gemini
    const encoder = new TextEncoder();
    let fullResponse = '';
    const abortController = new AbortController();

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChatResponse(trimmed, abortController.signal)) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();

          // Write to dedup cache (non-blocking)
          dedupCache.set(dedupHash, fullResponse, CHAT_DEDUP_TTL_MS);
          kv.set(kvKey, fullResponse, { ex: CHAT_DEDUP_TTL_SECONDS }).catch(() => {});

          // Log conversation to Vercel KV (non-blocking)
          logMessage(sessionId, ip, userMessage, fullResponse).catch(() => {});
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
      cancel() {
        abortController.abort();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-RateLimit-Remaining': String(remaining),
        'X-Cache': 'MISS',
      },
    });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: "I'm taking a break right now. Please try again later." },
      { status: 500 }
    );
  }
}
