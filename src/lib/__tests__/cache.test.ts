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
