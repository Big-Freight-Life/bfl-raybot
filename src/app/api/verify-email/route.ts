import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import dns from 'dns/promises';

const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'dispostable.com', 'trashmail.com', 'fakeinbox.com', 'maildrop.cc',
  'temp-mail.org', '10minutemail.com', 'tempail.com', 'tmpmail.net',
];

const BLOCKED_EMAILS = [
  'test@test.com', 'a@a.com', 'email@email.com', 'fake@fake.com',
  'asdf@asdf.com', 'no@no.com', 'none@none.com',
];

// POST: Validate email
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { allowed } = checkRateLimit(ip, 10, 10 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 });
  }

  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const trimmed = email.trim().toLowerCase();

    // Format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(trimmed)) {
      return NextResponse.json({ error: 'Enter a valid email address' }, { status: 400 });
    }

    // Blocked emails
    if (BLOCKED_EMAILS.includes(trimmed)) {
      return NextResponse.json({ error: 'Please use a real email address' }, { status: 400 });
    }

    // Disposable domain check
    const domain = trimmed.split('@')[1];
    if (DISPOSABLE_DOMAINS.includes(domain)) {
      return NextResponse.json({ error: 'Disposable email addresses are not allowed' }, { status: 400 });
    }

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
