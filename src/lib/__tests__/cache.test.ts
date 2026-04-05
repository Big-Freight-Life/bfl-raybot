import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('@vercel/kv', () => ({
  kv: {
    get: vi.fn(),
    set: vi.fn(),
  },
}));

describe('TTLCache', () => {
  let TTLCache: typeof import('../cache').TTLCache;

  beforeEach(async () => {
    vi.restoreAllMocks();
    const mod = await import('../cache');
    TTLCache = mod.TTLCache;
  });

  it('stores and retrieves a value', () => {
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 60_000);
    expect(cache.get('key1')).toBe('value1');
  });

  it('returns undefined for missing keys', () => {
    const cache = new TTLCache<string>(10);
    expect(cache.get('missing')).toBeUndefined();
  });

  it('returns undefined for expired entries', () => {
    vi.useFakeTimers();
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 1_000);
    vi.advanceTimersByTime(1_001);
    expect(cache.get('key1')).toBeUndefined();
    vi.useRealTimers();
  });

  it('has() returns false for expired entries', () => {
    vi.useFakeTimers();
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 1_000);
    vi.advanceTimersByTime(1_001);
    expect(cache.has('key1')).toBe(false);
    vi.useRealTimers();
  });

  it('has() returns true for valid entries', () => {
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 60_000);
    expect(cache.has('key1')).toBe(true);
  });

  it('evicts oldest entry when maxSize is reached', () => {
    const cache = new TTLCache<string>(2);
    cache.set('a', '1', 60_000);
    cache.set('b', '2', 60_000);
    cache.set('c', '3', 60_000);
    expect(cache.get('a')).toBeUndefined();
    expect(cache.get('b')).toBe('2');
    expect(cache.get('c')).toBe('3');
  });

  it('cleans up expired entries on access', () => {
    vi.useFakeTimers();
    const cache = new TTLCache<string>(10);
    cache.set('key1', 'value1', 1_000);
    vi.advanceTimersByTime(1_001);
    // Access triggers cleanup — subsequent has() should also be false
    cache.get('key1');
    expect(cache.has('key1')).toBe(false);
    vi.useRealTimers();
  });
});

describe('tieredGet', () => {
  let TTLCache: typeof import('../cache').TTLCache;
  let tieredGet: typeof import('../cache').tieredGet;
  let mockedKv: { get: ReturnType<typeof vi.fn>; set: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    vi.restoreAllMocks();
    const mod = await import('../cache');
    TTLCache = mod.TTLCache;
    tieredGet = mod.tieredGet;
    const kvMod = await import('@vercel/kv');
    mockedKv = kvMod.kv as unknown as typeof mockedKv;
  });

  it('returns from memory on memory hit (KV and fetcher not called)', async () => {
    const cache = new TTLCache<string>(10);
    cache.set('k', 'memVal', 60_000);
    const fetcher = vi.fn();

    const result = await tieredGet({
      memCache: cache,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'memVal', tier: 'memory' });
    expect(mockedKv.get).not.toHaveBeenCalled();
    expect(fetcher).not.toHaveBeenCalled();
  });

  it('returns from KV on KV hit and writes to memory (fetcher not called)', async () => {
    const cache = new TTLCache<string>(10);
    mockedKv.get.mockResolvedValue('kvVal');
    const fetcher = vi.fn();

    const result = await tieredGet({
      memCache: cache,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'kvVal', tier: 'kv' });
    expect(fetcher).not.toHaveBeenCalled();
    expect(cache.get('k')).toBe('kvVal');
  });

  it('calls fetcher on full miss and writes to both tiers', async () => {
    const cache = new TTLCache<string>(10);
    mockedKv.get.mockResolvedValue(null);
    mockedKv.set.mockResolvedValue('OK');
    const fetcher = vi.fn().mockResolvedValue('freshVal');

    const result = await tieredGet({
      memCache: cache,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'freshVal', tier: 'origin' });
    expect(cache.get('k')).toBe('freshVal');
    expect(mockedKv.set).toHaveBeenCalledWith('kv:k', 'freshVal', { ex: 60 });
  });

  it('falls through to fetcher on KV read error', async () => {
    const cache = new TTLCache<string>(10);
    mockedKv.get.mockRejectedValue(new Error('KV down'));
    mockedKv.set.mockResolvedValue('OK');
    const fetcher = vi.fn().mockResolvedValue('freshVal');

    const result = await tieredGet({
      memCache: cache,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'freshVal', tier: 'origin' });
    expect(fetcher).toHaveBeenCalled();
  });

  it('returns value even if KV write fails (logs error)', async () => {
    const cache = new TTLCache<string>(10);
    mockedKv.get.mockResolvedValue(null);
    mockedKv.set.mockRejectedValue(new Error('KV write fail'));
    const fetcher = vi.fn().mockResolvedValue('freshVal');
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const result = await tieredGet({
      memCache: cache,
      memKey: 'k',
      memTtlMs: 60_000,
      kvKey: 'kv:k',
      kvTtlSeconds: 60,
      fetcher,
    });

    expect(result).toEqual({ value: 'freshVal', tier: 'origin' });
    expect(cache.get('k')).toBe('freshVal');
    expect(errorSpy).toHaveBeenCalled();
    errorSpy.mockRestore();
  });
});
