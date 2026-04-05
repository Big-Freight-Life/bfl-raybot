import { NextRequest, NextResponse } from 'next/server';
import { streamChatResponse } from '@/lib/gemini';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import { RATE_LIMIT_CHAT, MAX_MESSAGES_HISTORY } from '@/lib/constants';
import { sanitizeMessage } from '@/lib/sanitization';
import { validateSessionId } from '@/lib/validators';
import { ChatMessage } from '@/lib/knowledge';
import { logMessage } from '@/lib/chat-logger';

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

    if (!messages.length || !messages[messages.length - 1]?.content) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Sanitize ALL messages
    const sanitized = messages.map((m) => ({ ...m, content: sanitizeMessage(m.content) }));
    const userMessage = sanitized[sanitized.length - 1].content;

    const trimmed = sanitized.slice(-MAX_MESSAGES_HISTORY);

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
