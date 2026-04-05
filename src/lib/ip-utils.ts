import { NextRequest } from 'next/server';

/**
 * Extract client IP from a Next.js request.
 * Checks request.ip first, then x-forwarded-for header.
 * Returns 'unknown' if no IP can be determined.
 */
export function getClientIP(request: NextRequest): string {
  // NextRequest.ip is typed in newer Next.js versions
  const directIP = (request as unknown as Record<string, unknown>).ip;
  if (typeof directIP === 'string' && directIP) {
    return directIP;
  }

  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for is "client, proxy1, proxy2" — first entry is the client
    const first = forwarded.split(',')[0]?.trim();
    if (first) return first;
  }

  return 'unknown';
}
