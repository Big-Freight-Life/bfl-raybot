import { describe, it, expect, vi, beforeEach } from 'vitest';

// We need a fresh module for each test to reset the in-memory Map
let checkRateLimit: typeof import('../rate-limit').checkRateLimit;

beforeEach(async () => {
  vi.resetModules();
  const mod = await import('../rate-limit');
  checkRateLimit = mod.checkRateLimit;
});

describe('checkRateLimit', () => {
  it('allows requests within limit', () => {
    const result = checkRateLimit('test', '1.1.1.1', 3, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
  });

  it('blocks requests over limit', () => {
    checkRateLimit('test', '1.1.1.1', 2, 60000);
    checkRateLimit('test', '1.1.1.1', 2, 60000);
    const result = checkRateLimit('test', '1.1.1.1', 2, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('resets after window expires', () => {
    vi.useFakeTimers();
    checkRateLimit('test', '1.1.1.1', 1, 1000);
    // First request used the slot
    const blocked = checkRateLimit('test', '1.1.1.1', 1, 1000);
    expect(blocked.allowed).toBe(false);

    // Advance past the window
    vi.advanceTimersByTime(1001);
    const result = checkRateLimit('test', '1.1.1.1', 1, 1000);
    expect(result.allowed).toBe(true);
    vi.useRealTimers();
  });

  it('keeps different route keys independent', () => {
    checkRateLimit('route-a', '1.1.1.1', 1, 60000);
    const resultB = checkRateLimit('route-b', '1.1.1.1', 1, 60000);
    expect(resultB.allowed).toBe(true);
  });

  it('returns correct remaining count', () => {
    const r1 = checkRateLimit('test', '1.1.1.1', 5, 60000);
    expect(r1.remaining).toBe(4);
    const r2 = checkRateLimit('test', '1.1.1.1', 5, 60000);
    expect(r2.remaining).toBe(3);
    const r3 = checkRateLimit('test', '1.1.1.1', 5, 60000);
    expect(r3.remaining).toBe(2);
  });
});
