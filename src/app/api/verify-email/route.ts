import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/rate-limit';

// In-memory store for verification codes (short-lived, cleared on redeploy)
const pendingCodes = new Map<string, { code: string; expiresAt: number; name: string }>();

function generateCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// POST: Send verification code
export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { allowed } = checkRateLimit(ip, 5, 10 * 60 * 1000); // 5 attempts per 10 min

  if (!allowed) {
    return NextResponse.json({ error: 'Too many attempts. Try again in a few minutes.' }, { status: 429 });
  }

  try {
    const { email, name } = await request.json();

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    const code = generateCode();
    pendingCodes.set(email.toLowerCase(), {
      code,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 min expiry
      name: name || '',
    });

    // Send code via Resend
    const resendKey = process.env.RESEND_API_KEY;
    if (resendKey) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Raybot <noreply@bfl.design>',
        to: email,
        subject: `Your Raybot verification code: ${code}`,
        text: `Your verification code is: ${code}\n\nThis code expires in 10 minutes.\n\nIf you didn't request this, you can ignore this email.`,
      });
    } else {
      // Dev fallback: log code to console
      console.log(`[DEV] Verification code for ${email}: ${code}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Verification send error:', error);
    return NextResponse.json({ error: 'Failed to send code' }, { status: 500 });
  }
}

// PUT: Verify code
export async function PUT(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 });
    }

    const entry = pendingCodes.get(email.toLowerCase());

    if (!entry) {
      return NextResponse.json({ error: 'No code found. Request a new one.' }, { status: 400 });
    }

    if (Date.now() > entry.expiresAt) {
      pendingCodes.delete(email.toLowerCase());
      return NextResponse.json({ error: 'Code expired. Request a new one.' }, { status: 400 });
    }

    if (entry.code !== code.trim()) {
      return NextResponse.json({ error: 'Invalid code. Try again.' }, { status: 400 });
    }

    // Code is valid — clean up
    pendingCodes.delete(email.toLowerCase());

    return NextResponse.json({ success: true, name: entry.name });
  } catch {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 });
  }
}
