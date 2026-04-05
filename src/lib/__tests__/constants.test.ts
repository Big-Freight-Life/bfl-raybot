import { describe, it, expect } from 'vitest';
import {
  RATE_LIMIT_CHAT,
  RATE_LIMIT_TTS,
  RATE_LIMIT_LEAD,
  RATE_LIMIT_FEEDBACK,
  RATE_LIMIT_VERIFY_EMAIL,
  STORAGE_KEY_HISTORY,
  STORAGE_KEY_SESSION_ID,
  STORAGE_KEY_USER_EMAIL,
  TEAL,
  SESSION_ID_REGEX,
  LEAD_FORM_TRIGGER,
} from '../constants';

describe('rate limits', () => {
  const limits = [
    { name: 'CHAT', value: RATE_LIMIT_CHAT },
    { name: 'TTS', value: RATE_LIMIT_TTS },
    { name: 'LEAD', value: RATE_LIMIT_LEAD },
    { name: 'FEEDBACK', value: RATE_LIMIT_FEEDBACK },
    { name: 'VERIFY_EMAIL', value: RATE_LIMIT_VERIFY_EMAIL },
  ];

  it.each(limits)('$name has positive maxHits', ({ value }) => {
    expect(value.maxHits).toBeGreaterThan(0);
  });

  it.each(limits)('$name has positive windowMs', ({ value }) => {
    expect(value.windowMs).toBeGreaterThan(0);
  });
});

describe('storage keys', () => {
  it('are non-empty strings', () => {
    expect(STORAGE_KEY_HISTORY).toBeTruthy();
    expect(STORAGE_KEY_SESSION_ID).toBeTruthy();
    expect(STORAGE_KEY_USER_EMAIL).toBeTruthy();
  });
});

describe('TEAL', () => {
  it('is a valid hex color', () => {
    expect(TEAL).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });
});

describe('regex patterns', () => {
  it('SESSION_ID_REGEX compiles and works', () => {
    expect(SESSION_ID_REGEX.test('abc-123')).toBe(true);
    expect(SESSION_ID_REGEX.test('has space')).toBe(false);
  });

  it('LEAD_FORM_TRIGGER compiles and matches expected phrases', () => {
    expect(LEAD_FORM_TRIGGER.test('send me an email')).toBe(true);
    expect(LEAD_FORM_TRIGGER.test('Book A Call')).toBe(true);
    expect(LEAD_FORM_TRIGGER.test('random text')).toBe(false);
  });
});
