import { NextRequest, NextResponse } from 'next/server';
import dns from 'dns/promises';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import { RATE_LIMIT_VERIFY_EMAIL, MX_CACHE_TTL_MS, MX_CACHE_TTL_SECONDS, MX_CACHE_MAX_SIZE } from '@/lib/constants';
import { isValidEmailFormat, isBlockedEmail, isDisposableDomain, getEmailDomain } from '@/lib/validators';
import { TTLCache, tieredGet } from '@/lib/cache';

const mxCache = new TTLCache<boolean>(MX_CACHE_MAX_SIZE);

export async function POST(request: NextRequest) {
  const result = await validateRequest(request, {
    routeKey: 'verify-email',
    ...RATE_LIMIT_VERIFY_EMAIL,
  });
  if (isErrorResponse(result)) return result;

  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();

    if (!isValidEmailFormat(trimmed)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    if (isBlockedEmail(trimmed)) {
      return NextResponse.json({ error: 'Please use a real email address' }, { status: 400 });
    }

    if (isDisposableDomain(trimmed)) {
      return NextResponse.json({ error: 'Disposable email addresses are not allowed' }, { status: 400 });
    }

    const domain = getEmailDomain(trimmed);

    // MX record check with two-tier cache
    try {
      const { value: hasMx, tier } = await tieredGet({
        memCache: mxCache,
        memKey: domain,
        memTtlMs: MX_CACHE_TTL_MS,
        kvKey: `mx:${domain}`,
        kvTtlSeconds: MX_CACHE_TTL_SECONDS,
        fetcher: async () => {
          const records = await dns.resolveMx(domain);
          return Array.isArray(records) && records.length > 0;
        },
      });

      if (!hasMx) {
        return NextResponse.json(
          { error: 'This email domain doesn\u2019t appear to accept email' },
          { status: 400, headers: { 'X-Cache': tier === 'origin' ? 'MISS' : 'HIT', 'X-Cache-Tier': tier } },
        );
      }

      return NextResponse.json(
        { success: true },
        { headers: { 'X-Cache': tier === 'origin' ? 'MISS' : 'HIT', 'X-Cache-Tier': tier } },
      );
    } catch {
      return NextResponse.json({ error: 'Could not verify this email domain' }, { status: 400 });
    }
  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
