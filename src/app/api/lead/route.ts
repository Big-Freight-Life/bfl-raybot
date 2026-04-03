import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown';
  const { allowed } = checkRateLimit(ip, 3, 60 * 60 * 1000);

  if (!allowed) {
    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
  }

  try {
    const { name, email, message } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;
    if (resendKey && contactEmail) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: 'Raybot <noreply@bfl.design>',
        to: contactEmail,
        subject: `Raybot Lead: ${name || 'Anonymous'}`,
        text: `Name: ${name || 'Not provided'}\nEmail: ${email}\nMessage: ${message || 'No message'}\n\nSent from raybot.bfl.design`,
      });
    }

    const slackUrl = process.env.SLACK_WEBHOOK_URL;
    if (slackUrl) {
      await fetch(slackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: `New Raybot Lead\n*Name:* ${name || 'Not provided'}\n*Email:* ${email}\n*Message:* ${message || 'No message'}`,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lead capture error:', error);
    return NextResponse.json({ error: 'Failed to send' }, { status: 500 });
  }
}
