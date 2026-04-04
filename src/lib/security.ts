import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  'https://bfl-raybot.vercel.app',
  'https://raybot.bfl.design',
];

function getAllowedOrigins(): string[] {
  const origins = [...ALLOWED_ORIGINS];

  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    origins.push(`https://${vercelUrl}`);
  }

  if (process.env.NODE_ENV === 'development') {
    origins.push('http://localhost:3000');
  }

  return origins;
}

export function validateOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const check = origin || referer;
  if (!check) return false;

  const allowed = getAllowedOrigins();
  return allowed.some((o) => check === o || check.startsWith(o + '/'));
}

export function requireOrigin(request: NextRequest): NextResponse | null {
  if (!validateOrigin(request)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }
  return null;
}

export function requireJSON(request: NextRequest): NextResponse | null {
  const ct = request.headers.get('content-type') ?? '';
  if (!ct.includes('application/json')) {
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 400 },
    );
  }
  return null;
}
