import { describe, it, expect } from 'vitest';
import { getClientIP } from '../ip-utils';

/** Create a minimal mock that satisfies what getClientIP reads */
function mockNextRequest(options: {
  ip?: string;
  forwardedFor?: string;
}): Parameters<typeof getClientIP>[0] {
  const headers = new Headers();
  if (options.forwardedFor) {
    headers.set('x-forwarded-for', options.forwardedFor);
  }
  const req = {
    ip: options.ip,
    headers,
  };
  return req as unknown as Parameters<typeof getClientIP>[0];
}

describe('getClientIP', () => {
  it('uses request.ip when available', () => {
    const req = mockNextRequest({ ip: '1.2.3.4' });
    expect(getClientIP(req)).toBe('1.2.3.4');
  });

  it('falls back to x-forwarded-for (first entry)', () => {
    const req = mockNextRequest({ forwardedFor: '10.0.0.1, 10.0.0.2' });
    expect(getClientIP(req)).toBe('10.0.0.1');
  });

  it('returns unknown when no IP available', () => {
    const req = mockNextRequest({});
    expect(getClientIP(req)).toBe('unknown');
  });

  it('handles comma-separated forwarded header', () => {
    const req = mockNextRequest({ forwardedFor: '192.168.1.1, 172.16.0.1, 10.0.0.1' });
    expect(getClientIP(req)).toBe('192.168.1.1');
  });

  it('prefers request.ip over forwarded header', () => {
    const req = mockNextRequest({ ip: '1.1.1.1', forwardedFor: '2.2.2.2' });
    expect(getClientIP(req)).toBe('1.1.1.1');
  });
});
