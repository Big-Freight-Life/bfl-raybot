import { describe, it, expect } from 'vitest';
import {
  validateSessionId,
  isValidEmailFormat,
  isBlockedEmail,
  isDisposableDomain,
  getEmailDomain,
} from '../validators';

describe('validateSessionId', () => {
  it('accepts valid session IDs', () => {
    expect(validateSessionId('abc-123')).toBe(true);
    expect(validateSessionId('session-id-456')).toBe(true);
  });

  it('rejects IDs that are too long', () => {
    expect(validateSessionId('a'.repeat(65))).toBe(false);
  });

  it('rejects IDs with invalid characters', () => {
    expect(validateSessionId('has spaces')).toBe(false);
    expect(validateSessionId('has@special!')).toBe(false);
  });

  it('rejects empty string', () => {
    expect(validateSessionId('')).toBe(false);
  });

  it('rejects non-string values', () => {
    expect(validateSessionId(123)).toBe(false);
    expect(validateSessionId(null)).toBe(false);
    expect(validateSessionId(undefined)).toBe(false);
  });
});

describe('isValidEmailFormat', () => {
  it('accepts valid emails', () => {
    expect(isValidEmailFormat('user@example.com')).toBe(true);
    expect(isValidEmailFormat('name+tag@domain.org')).toBe(true);
  });

  it('rejects missing @', () => {
    expect(isValidEmailFormat('userexample.com')).toBe(false);
  });

  it('rejects missing domain', () => {
    expect(isValidEmailFormat('user@')).toBe(false);
  });

  it('rejects short TLD (less than 2 chars)', () => {
    expect(isValidEmailFormat('user@example.c')).toBe(false);
  });
});

describe('isBlockedEmail', () => {
  it('blocks known test emails', () => {
    expect(isBlockedEmail('test@test.com')).toBe(true);
    expect(isBlockedEmail('fake@fake.com')).toBe(true);
  });

  it('is case insensitive', () => {
    expect(isBlockedEmail('TEST@TEST.COM')).toBe(true);
  });

  it('allows non-blocked emails', () => {
    expect(isBlockedEmail('real@company.com')).toBe(false);
  });
});

describe('isDisposableDomain', () => {
  it('detects known disposable domains', () => {
    expect(isDisposableDomain('anyone@mailinator.com')).toBe(true);
    expect(isDisposableDomain('user@guerrillamail.com')).toBe(true);
  });

  it('passes normal domains', () => {
    expect(isDisposableDomain('user@gmail.com')).toBe(false);
  });
});

describe('getEmailDomain', () => {
  it('extracts domain from email', () => {
    expect(getEmailDomain('user@example.com')).toBe('example.com');
  });

  it('returns empty string when no @ present', () => {
    expect(getEmailDomain('nodomain')).toBe('');
  });

  it('trims and lowercases', () => {
    expect(getEmailDomain('  User@Example.COM  ')).toBe('example.com');
  });
});
