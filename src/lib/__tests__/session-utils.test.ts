import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateSessionId, getOrCreateSessionId } from '../session-utils';
import { STORAGE_KEY_SESSION_ID } from '../constants';

describe('generateSessionId', () => {
  it('returns a string in expected format (timestamp-random)', () => {
    const id = generateSessionId();
    expect(typeof id).toBe('string');
    // Format: <timestamp>-<random alphanumeric>
    expect(id).toMatch(/^\d+-[a-z0-9]+$/);
  });

  it('generates unique IDs', () => {
    const id1 = generateSessionId();
    const id2 = generateSessionId();
    expect(id1).not.toBe(id2);
  });
});

describe('getOrCreateSessionId', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    // Mock sessionStorage on the global window object
    Object.defineProperty(globalThis, 'sessionStorage', {
      value: {
        getItem: vi.fn((key: string) => store[key] ?? null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('creates new ID when none exists', () => {
    const id = getOrCreateSessionId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
    expect(sessionStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY_SESSION_ID, id);
  });

  it('returns existing ID from sessionStorage', () => {
    store[STORAGE_KEY_SESSION_ID] = 'existing-id-123';
    const id = getOrCreateSessionId();
    expect(id).toBe('existing-id-123');
    expect(sessionStorage.setItem).not.toHaveBeenCalled();
  });
});
