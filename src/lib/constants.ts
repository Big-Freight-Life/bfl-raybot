// ─── Storage Keys ───
export const STORAGE_KEY_HISTORY = 'raybot_history';
export const STORAGE_KEY_SESSION_ID = 'raybot_session_id';
export const STORAGE_KEY_USER_EMAIL = 'raybot_user_email';

// ─── Message Limits ───
export const MAX_MESSAGES_HISTORY = 50;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_TTS_TEXT_LENGTH = 1000;
export const MAX_LOG_MESSAGES = 100;
export const MAX_NAME_LENGTH = 100;
export const MAX_EMAIL_LENGTH = 254;
export const MAX_LEAD_MESSAGE_LENGTH = 1000;

// ─── Session ───
export const SESSION_ID_MAX_LENGTH = 64;
export const SESSION_ID_REGEX = /^[a-zA-Z0-9-]+$/;

// ─── Rate Limits (maxHits, windowMs) ───
export const RATE_LIMIT_CHAT = { maxHits: 20, windowMs: 60 * 60 * 1000 } as const;
export const RATE_LIMIT_TTS = { maxHits: 20, windowMs: 60 * 60 * 1000 } as const;
export const RATE_LIMIT_LEAD = { maxHits: 3, windowMs: 60 * 60 * 1000 } as const;
export const RATE_LIMIT_FEEDBACK = { maxHits: 30, windowMs: 60 * 60 * 1000 } as const;
export const RATE_LIMIT_VERIFY_EMAIL = { maxHits: 10, windowMs: 10 * 60 * 1000 } as const;

// ─── KV Logging ───
export const CHAT_LOG_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

// ─── Gemini Model ───
export const GEMINI_MODEL = 'gemini-2.5-flash';
export const GEMINI_MAX_OUTPUT_TOKENS = 1024;
export const GEMINI_TEMPERATURE = 0.7;

// ─── UI / Theme ───
export const SIDEBAR_WIDTH_COLLAPSED = 52;
export const SIDEBAR_WIDTH_EXPANDED = 260;
export const TEAL = '#117680';
export const TEAL_BG = `${TEAL}0F`; // 6% opacity for active backgrounds

// ─── Lead Form Trigger ───
export const LEAD_FORM_TRIGGER = /send me an email|book a call/i;

// ─── Email ───
export const NOREPLY_EMAIL = 'Raybot <noreply@bfl.design>';

// ─── Disposable Email Domains ───
export const DISPOSABLE_DOMAINS = [
  'mailinator.com', 'guerrillamail.com', 'tempmail.com', 'throwaway.email',
  'yopmail.com', 'sharklasers.com', 'guerrillamailblock.com', 'grr.la',
  'dispostable.com', 'trashmail.com', 'fakeinbox.com', 'maildrop.cc',
  'temp-mail.org', '10minutemail.com', 'tempail.com', 'tmpmail.net',
] as const;

// ─── Blocked Test Emails ───
export const BLOCKED_EMAILS = [
  'test@test.com', 'a@a.com', 'email@email.com', 'fake@fake.com',
  'asdf@asdf.com', 'no@no.com', 'none@none.com',
] as const;

// ─── Cache: TTS ───
export const TTS_CACHE_TTL_MS = 3_600_000; // 1 hour
export const TTS_CACHE_TTL_SECONDS = 3_600;
export const TTS_CACHE_MAX_SIZE = 200;

// ─── Cache: MX Records ───
export const MX_CACHE_TTL_MS = 86_400_000; // 24 hours
export const MX_CACHE_TTL_SECONDS = 86_400;
export const MX_CACHE_MAX_SIZE = 500;

// ─── Cache: Chat Dedup ───
export const CHAT_DEDUP_TTL_MS = 300_000; // 5 minutes
export const CHAT_DEDUP_TTL_SECONDS = 300;
export const CHAT_DEDUP_MAX_SIZE = 200;
