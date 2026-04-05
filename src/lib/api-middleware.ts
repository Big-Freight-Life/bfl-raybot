import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from './rate-limit';
import { requireOrigin, requireJSON } from './security';
import { getClientIP } from './ip-utils';

interface MiddlewareOptions {
  /** Route key for rate limiting (e.g. 'chat', 'tts') */
  routeKey: string;
  /** Max requests in window */
  maxHits: number;
  /** Rate limit window in milliseconds */
  windowMs: number;
}

interface ValidatedRequest {
  ip: string;
  remaining: number;
}

/**
 * Run common API middleware checks: origin, content-type, rate limit.
 * Returns either a ValidatedRequest on success or a NextResponse error.
 */
export async function validateRequest(
  request: NextRequest,
  options: MiddlewareOptions
): Promise<ValidatedRequest | NextResponse> {
  const ip = getClientIP(request);
  const { allowed, remaining } = await checkRateLimit(
    options.routeKey,
    ip,
    options.maxHits,
    options.windowMs
  );

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

  return { ip, remaining };
}

/** Type guard: check if validateRequest returned an error response */
export function isErrorResponse(result: ValidatedRequest | NextResponse): result is NextResponse {
  return result instanceof NextResponse;
}
