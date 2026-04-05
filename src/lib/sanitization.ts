import { MAX_MESSAGE_LENGTH } from './constants';

/** Strip HTML tags from text */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').trim();
}

/** Sanitize a chat message: strip HTML and enforce length limit */
export function sanitizeMessage(text: string, maxLength = MAX_MESSAGE_LENGTH): string {
  return stripHtml(text).slice(0, maxLength);
}

/** Sanitize and normalize an email address */
export function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase().slice(0, 254);
}
