import { NextRequest, NextResponse } from 'next/server';
import { streamChatResponse } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rate-limit';
import { requireOrigin, requireJSON } from '@/lib/security';
import { ChatMessage } from '@/lib/knowledge';
import { logMessage } from '@/lib/chat-logger';

function sanitize(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim().slice(0, 2000);
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { allowed, remaining } = checkRateLimit(ip, 20, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again later.' },
      { status: 429, headers: { 'X-RateLimit-Remaining': '0' } }
    );
  }

  const originError = requireOrigin(request);
  if (originError) return originError;

  const jsonError = requireJSON(request);
  if (jsonError) return jsonError;

  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages ?? [];
    const rawSessionId = body.sessionId;
    const sessionId: string =
      typeof rawSessionId === 'string' &&
      rawSessionId.length <= 64 &&
      /^[a-zA-Z0-9-]+$/.test(rawSessionId)
        ? rawSessionId
        : 'unknown';

    if (!messages.length || !messages[messages.length - 1]?.content) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const sanitized = [...messages];
    const last = sanitized[sanitized.length - 1];
    const userMessage = sanitize(last.content);
    sanitized[sanitized.length - 1] = { ...last, content: userMessage };

    const trimmed = sanitized.slice(-50);

    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamChatResponse(trimmed)) {
            fullResponse += chunk;
            controller.enqueue(encoder.encode(chunk));
          }
          controller.close();

          // Log conversation to Vercel KV (non-blocking)
          logMessage(sessionId, ip, userMessage, fullResponse).catch(() => {});
        } catch (error) {
          console.error('Stream error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'X-RateLimit-Remaining': String(remaining),
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
