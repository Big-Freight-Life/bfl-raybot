import { NextRequest, NextResponse } from 'next/server';
import { generateChatResponse } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rate-limit';
import { ChatMessage } from '@/lib/knowledge';

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

  try {
    const body = await request.json();
    const messages: ChatMessage[] = body.messages ?? [];

    if (!messages.length || !messages[messages.length - 1]?.content) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const sanitized = [...messages];
    const last = sanitized[sanitized.length - 1];
    sanitized[sanitized.length - 1] = { ...last, content: sanitize(last.content) };

    const trimmed = sanitized.slice(-50);
    const response = await generateChatResponse(trimmed);

    return NextResponse.json(
      { response, handoff: /send me an email|book a call/i.test(response) },
      { headers: { 'X-RateLimit-Remaining': String(remaining) } }
    );
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: "I'm taking a break right now. Please try again later." },
      { status: 500 }
    );
  }
}
