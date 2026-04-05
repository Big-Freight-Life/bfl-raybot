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
