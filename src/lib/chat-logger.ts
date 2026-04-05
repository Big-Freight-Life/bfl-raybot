import { kv } from '@vercel/kv';
import { createHash } from 'crypto';
import { CHAT_LOG_TTL_SECONDS, MAX_LOG_MESSAGES } from './constants';
import type { LogEntry, SessionLog } from '@/types/chat';

function hashIP(ip: string): string {
  return createHash('sha256').update(ip + (process.env.KV_REST_API_TOKEN || 'salt')).digest('hex').slice(0, 16);
}

export async function logMessage(
  sessionId: string,
  ip: string,
  userMessage: string,
  botResponse: string,
): Promise<void> {
  try {
    const key = `chat:${sessionId}`;
    const existing = await kv.get<SessionLog>(key);

    const now = new Date().toISOString();
    const newEntries: LogEntry[] = [
      { role: 'user', content: userMessage, timestamp: now },
      { role: 'model', content: botResponse, timestamp: now },
    ];

    if (existing) {
      existing.messages.push(...newEntries);
      existing.updatedAt = now;
      // Cap at MAX_LOG_MESSAGES per session
      if (existing.messages.length > MAX_LOG_MESSAGES) {
        existing.messages = existing.messages.slice(-MAX_LOG_MESSAGES);
      }
      await kv.set(key, existing, { ex: CHAT_LOG_TTL_SECONDS });
    } else {
      const session: SessionLog = {
        sessionId,
        ipHash: hashIP(ip),
        createdAt: now,
        updatedAt: now,
        messages: newEntries,
      };
      await kv.set(key, session, { ex: CHAT_LOG_TTL_SECONDS });
    }
  } catch (error) {
    // Logging failure should never break chat
    console.error('Chat log error:', error);
  }
}
