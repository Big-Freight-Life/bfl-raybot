import { SESSION_ID_MAX_LENGTH, SESSION_ID_REGEX, DISPOSABLE_DOMAINS, BLOCKED_EMAILS } from './constants';

/** Email format regex — requires user@domain.tld (TLD >= 2 chars) */
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validate a session ID string */
export function validateSessionId(id: unknown): id is string {
  return (
    typeof id === 'string' &&
    id.length > 0 &&
    id.length <= SESSION_ID_MAX_LENGTH &&
    SESSION_ID_REGEX.test(id)
  );
}

/** Validate email format */
export function isValidEmailFormat(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

/** Check if email is in the blocked list */
export function isBlockedEmail(email: string): boolean {
  return (BLOCKED_EMAILS as readonly string[]).includes(email.toLowerCase().trim());
}

/** Check if email domain is a known disposable provider */
export function isDisposableDomain(email: string): boolean {
  const domain = email.toLowerCase().trim().split('@')[1];
  return domain ? (DISPOSABLE_DOMAINS as readonly string[]).includes(domain) : false;
}

/** Extract domain from email */
export function getEmailDomain(email: string): string {
  return email.trim().toLowerCase().split('@')[1] || '';
}
