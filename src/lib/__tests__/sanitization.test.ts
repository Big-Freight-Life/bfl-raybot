import { describe, it, expect } from 'vitest';
import { stripHtml, sanitizeMessage, sanitizeEmail } from '../sanitization';

describe('stripHtml', () => {
  it('removes HTML tags', () => {
    expect(stripHtml('<b>hello</b>')).toBe('hello');
  });

  it('trims whitespace', () => {
    expect(stripHtml('  hello  ')).toBe('hello');
  });

  it('handles nested tags', () => {
    expect(stripHtml('<div><span>nested</span></div>')).toBe('nested');
  });

  it('handles empty string', () => {
    expect(stripHtml('')).toBe('');
  });

  it('handles text with no tags', () => {
    expect(stripHtml('plain text')).toBe('plain text');
  });
});

describe('sanitizeMessage', () => {
  it('strips HTML and enforces default length limit', () => {
    const longMsg = '<b>' + 'a'.repeat(3000) + '</b>';
    const result = sanitizeMessage(longMsg);
    expect(result).not.toContain('<');
    expect(result.length).toBeLessThanOrEqual(2000);
  });

  it('accepts custom max length', () => {
    const result = sanitizeMessage('hello world', 5);
    expect(result).toBe('hello');
  });

  it('preserves text within limit', () => {
    expect(sanitizeMessage('short')).toBe('short');
  });
});

describe('sanitizeEmail', () => {
  it('trims whitespace', () => {
    expect(sanitizeEmail('  user@test.com  ')).toBe('user@test.com');
  });

  it('lowercases', () => {
    expect(sanitizeEmail('User@Test.COM')).toBe('user@test.com');
  });

  it('truncates at 254 characters', () => {
    const longEmail = 'a'.repeat(300) + '@test.com';
    expect(sanitizeEmail(longEmail).length).toBe(254);
  });
});
