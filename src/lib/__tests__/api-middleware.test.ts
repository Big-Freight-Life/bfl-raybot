import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';
import { validateRequest, isErrorResponse } from '../api-middleware';

// Mock rate-limit
vi.mock('../rate-limit', () => ({
  checkRateLimit: vi.fn(),
}));

// Mock security
vi.mock('../security', () => ({
  requireOrigin: vi.fn(),
  requireJSON: vi.fn(),
}));

// Mock ip-utils
vi.mock('../ip-utils', () => ({
  getClientIP: vi.fn(() => '127.0.0.1'),
}));

import { checkRateLimit } from '../rate-limit';
import { requireOrigin, requireJSON } from '../security';

const mockedCheckRateLimit = vi.mocked(checkRateLimit);
const mockedRequireOrigin = vi.mocked(requireOrigin);
const mockedRequireJSON = vi.mocked(requireJSON);

function createRequest(): NextRequest {
  return new NextRequest('https://raybot.bfl.design/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Origin: 'https://raybot.bfl.design',
    },
  });
}

const defaultOptions = { routeKey: 'chat', maxHits: 20, windowMs: 60000 };

describe('validateRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 19 });
    mockedRequireOrigin.mockReturnValue(null);
    mockedRequireJSON.mockReturnValue(null);
  });

  it('returns error on rate limit exceeded', async () => {
    mockedCheckRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });
    const result = await validateRequest(createRequest(), defaultOptions);
    expect(result).toBeInstanceOf(NextResponse);
  });

  it('returns error on bad origin', async () => {
    mockedRequireOrigin.mockReturnValue(
      NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    );
    const result = await validateRequest(createRequest(), defaultOptions);
    expect(result).toBeInstanceOf(NextResponse);
  });

  it('returns error on wrong content-type', async () => {
    mockedRequireJSON.mockReturnValue(
      NextResponse.json({ error: 'Bad content-type' }, { status: 400 })
    );
    const result = await validateRequest(createRequest(), defaultOptions);
    expect(result).toBeInstanceOf(NextResponse);
  });

  it('returns { ip, remaining } on success', async () => {
    const result = await validateRequest(createRequest(), defaultOptions);
    expect(result).not.toBeInstanceOf(NextResponse);
    expect(result).toEqual({ ip: '127.0.0.1', remaining: 19 });
  });
});

describe('isErrorResponse', () => {
  it('returns true for NextResponse', () => {
    expect(isErrorResponse(NextResponse.json({}))).toBe(true);
  });

  it('returns false for ValidatedRequest', () => {
    expect(isErrorResponse({ ip: '1.2.3.4', remaining: 5 } as never)).toBe(false);
  });
});
