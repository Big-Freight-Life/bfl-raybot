import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/elevenlabs';
import { checkRateLimit } from '@/lib/rate-limit';
import { requireOrigin, requireJSON } from '@/lib/security';

export async function POST(request: NextRequest) {
  const ip = (request as any).ip ?? request.headers.get('x-forwarded-for')?.split(',').pop()?.trim() ?? 'unknown';
  const { allowed } = checkRateLimit('tts', ip, 20, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  const originError = requireOrigin(request);
  if (originError) return originError;

  const jsonError = requireJSON(request);
  if (jsonError) return jsonError;

  try {
    const { text } = await request.json();
    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Text is required' }, { status: 400 });
    }

    const audioBuffer = await textToSpeech(text.slice(0, 1000));
    const base64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({ audio: base64 });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Voice unavailable' }, { status: 500 });
  }
}
