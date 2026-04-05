import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock @vercel/kv before importing the module under test
const mockIncr = vi.fn<(key: string) => Promise<number>>();
const mockExpire = vi.fn<(key: string, seconds: number) => Promise<number>>();

vi.mock('@vercel/kv', () => ({
  kv: {
    incr: (...args: [string]) => mockIncr(...args),
    expire: (...args: [string, number]) => mockExpire(...args),
  },
}));

let checkRateLimit: typeof import('../rate-limit').checkRateLimit;

// Track the KV call count to simulate incrementing counter
let kvCounter: Record<string, number>;

beforeEach(async () => {
  vi.resetModules();
  mockIncr.mockReset();
  mockExpire.mockReset();
  kvCounter = {};

  // Simulate KV INCR: each call increments and returns count
  mockIncr.mockImplementation(async (key: string) => {
    kvCounter[key] = (kvCounter[key] ?? 0) + 1;
    return kvCounter[key];
  });
  mockExpire.mockResolvedValue(1);

  const mod = await import('../rate-limit');
  checkRateLimit = mod.checkRateLimit;
});

describe('checkRateLimit (KV-backed)', () => {
  it('allows requests within limit', async () => {
    const result = await checkRateLimit('test', '1.1.1.1', 3, 60000);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(2);
    expect(mockIncr).toHaveBeenCalledOnce();
  });

  it('sets TTL on first hit', async () => {
    await checkRateLimit('test', '1.1.1.1', 3, 60000);
    expect(mockExpire).toHaveBeenCalledOnce();
    expect(mockExpire).toHaveBeenCalledWith(expect.any(String), 60);
  });

  it('does not set TTL on subsequent hits', async () => {
    await checkRateLimit('test', '1.1.1.1', 3, 60000);
    mockExpire.mockClear();
    await checkRateLimit('test', '1.1.1.1', 3, 60000);
    expect(mockExpire).not.toHaveBeenCalled();
  });

  it('blocks requests over limit', async () => {
    await checkRateLimit('test', '1.1.1.1', 2, 60000);
    await checkRateLimit('test', '1.1.1.1', 2, 60000);
    const result = await checkRateLimit('test', '1.1.1.1', 2, 60000);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('keeps different route keys independent', async () => {
    await checkRateLimit('route-a', '1.1.1.1', 1, 60000);
    const resultB = await checkRateLimit('route-b', '1.1.1.1', 1, 60000);
    expect(resultB.allowed).toBe(true);
  });

  it('returns correct remaining count', async () => {
    const r1 = await checkRateLimit('test', '1.1.1.1', 5, 60000);
    expect(r1.remaining).toBe(4);
    const r2 = await checkRateLimit('test', '1.1.1.1', 5, 60000);
    expect(r2.remaining).toBe(3);
    const r3 = await checkRateLimit('test', '1.1.1.1', 5, 60000);
    expect(r3.remaining).toBe(2);
  });

  it('falls back to in-memory when KV fails', async () => {
    mockIncr.mockRejectedValue(new Error('KV unavailable'));
    const r1 = await checkRateLimit('test', '1.1.1.1', 2, 60000);
    expect(r1.allowed).toBe(true);
    expect(r1.remaining).toBe(1);

    const r2 = await checkRateLimit('test', '1.1.1.1', 2, 60000);
    expect(r2.allowed).toBe(true);
    expect(r2.remaining).toBe(0);

    const r3 = await checkRateLimit('test', '1.1.1.1', 2, 60000);
    expect(r3.allowed).toBe(false);
  });

  it('uses local fast-path reject for known over-limit IPs', async () => {
    // Exhaust limit via KV
    await checkRateLimit('test', '1.1.1.1', 1, 60000);
    await checkRateLimit('test', '1.1.1.1', 1, 60000);
    mockIncr.mockClear();

    // Next call should be rejected from local cache without hitting KV
    const result = await checkRateLimit('test', '1.1.1.1', 1, 60000);
    expect(result.allowed).toBe(false);
    expect(mockIncr).not.toHaveBeenCalled();
  });
});
