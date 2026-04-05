import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateRequest, isErrorResponse } from '@/lib/api-middleware';
import { RATE_LIMIT_LEAD, MAX_NAME_LENGTH, MAX_LEAD_MESSAGE_LENGTH, NOREPLY_EMAIL } from '@/lib/constants';
import { stripHtml, sanitizeEmail } from '@/lib/sanitization';
import { isValidEmailFormat } from '@/lib/validators';

export async function POST(request: NextRequest) {
  const result = validateRequest(request, {
    routeKey: 'lead',
    ...RATE_LIMIT_LEAD,
  });
  if (isErrorResponse(result)) return result;

  try {
    const body = await request.json();

    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    if (!isValidEmailFormat(body.email.trim())) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 });
    }

    const name = typeof body.name === 'string' ? stripHtml(body.name).slice(0, MAX_NAME_LENGTH) : '';
    const email = sanitizeEmail(body.email);
    const message = typeof body.message === 'string' ? stripHtml(body.message).slice(0, MAX_LEAD_MESSAGE_LENGTH) : '';

    const resendKey = process.env.RESEND_API_KEY;
    const contactEmail = process.env.CONTACT_EMAIL;
    if (resendKey && contactEmail) {
      const resend = new Resend(resendKey);
      await resend.emails.send({
        from: NOREPLY_EMAIL,
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
