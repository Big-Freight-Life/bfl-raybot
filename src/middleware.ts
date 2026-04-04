import { NextResponse } from 'next/server';

export function middleware() {
  return new NextResponse(
    `<!DOCTYPE html>
<html><head><title>Raybot — Maintenance</title>
<style>body{margin:0;min-height:100vh;display:flex;align-items:center;justify-content:center;background:#0a0a0a;color:#fff;font-family:system-ui,sans-serif;text-align:center}
.wrap{max-width:400px;padding:2rem}h1{font-size:1.5rem;margin-bottom:0.5rem}p{color:#888;font-size:0.95rem}</style>
</head><body><div class="wrap"><h1>Be right back</h1><p>Raybot is offline for maintenance. Check back shortly.</p></div></body></html>`,
    { status: 503, headers: { 'Content-Type': 'text/html', 'Retry-After': '3600' } }
  );
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
