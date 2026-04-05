import { NextRequest, NextResponse } from 'next/server';
import { textToSpeech } from '@/lib/elevenlabs';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import { RATE_LIMIT_TTS, MAX_TTS_TEXT_LENGTH } from '@/lib/constants';

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

    const audioBuffer = await textToSpeech(text.slice(0, MAX_TTS_TEXT_LENGTH));
    const base64 = Buffer.from(audioBuffer).toString('base64');

    return NextResponse.json({ audio: base64 });
  } catch (error) {
    console.error('TTS error:', error);
    return NextResponse.json({ error: 'Voice unavailable' }, { status: 500 });
  }
}
