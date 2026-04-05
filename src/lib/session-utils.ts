import { STORAGE_KEY_SESSION_ID } from './constants';

/** Generate a new session ID */
export function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** Get or create a session ID from sessionStorage */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return generateSessionId();

  let sid = sessionStorage.getItem(STORAGE_KEY_SESSION_ID);
  if (!sid) {
    sid = generateSessionId();
    sessionStorage.setItem(STORAGE_KEY_SESSION_ID, sid);
  }
  return sid;
}
