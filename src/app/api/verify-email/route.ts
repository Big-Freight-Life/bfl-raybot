import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import { RATE_LIMIT_VERIFY_EMAIL } from '@/lib/constants';
import { isValidEmailFormat, isBlockedEmail, isDisposableDomain, getEmailDomain } from '@/lib/validators';
import dns from 'dns/promises';

// POST: Validate email
export async function POST(request: NextRequest) {
  const result = validateRequest(request, {
    routeKey: 'verify-email',
    ...RATE_LIMIT_VERIFY_EMAIL,
  });
  if (isErrorResponse(result)) return result;

  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();

    // Format check
    if (!isValidEmailFormat(trimmed)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    // Blocked emails
    if (isBlockedEmail(trimmed)) {
      return NextResponse.json({ error: 'Please use a real email address' }, { status: 400 });
    }

    // Disposable domain check
    if (isDisposableDomain(trimmed)) {
      return NextResponse.json({ error: 'Disposable email addresses are not allowed' }, { status: 400 });
    }

    const domain = getEmailDomain(trimmed);

    // MX record check — does the domain actually accept email?
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json({ error: 'This email domain doesn\u2019t appear to accept email' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Could not verify this email domain' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Email validation error:', error);
    return NextResponse.json({ error: 'Validation failed' }, { status: 500 });
  }
}
