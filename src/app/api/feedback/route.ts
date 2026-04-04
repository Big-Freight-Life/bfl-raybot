import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { requireOrigin, requireJSON } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { allowed } = checkRateLimit(ip, 30, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const originError = requireOrigin(request);
  if (originError) return originError;

  const jsonError = requireJSON(request);
  if (jsonError) return jsonError;

  try {
    const { messageIndex, feedback } = await request.json();

    if (typeof messageIndex !== 'number') {
      return NextResponse.json({ error: 'Invalid messageIndex' }, { status: 400 });
    }

    if (feedback !== 'like' && feedback !== 'dislike') {
      return NextResponse.json({ error: 'Invalid feedback value' }, { status: 400 });
    }

    console.log(`Feedback: message=${messageIndex}, type=${feedback}`);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
