import { kv } from '@vercel/kv';
import { createHash } from 'crypto';

const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

interface LogEntry {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

interface SessionLog {
  sessionId: string;
  ipHash: string;
  createdAt: string;
  updatedAt: string;
  messages: LogEntry[];
}

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
      // Cap at 100 messages per session
      if (existing.messages.length > 100) {
        existing.messages = existing.messages.slice(-100);
      }
      await kv.set(key, existing, { ex: TTL_SECONDS });
    } else {
      const session: SessionLog = {
        sessionId,
        ipHash: hashIP(ip),
        createdAt: now,
        updatedAt: now,
        messages: newEntries,
      };
      await kv.set(key, session, { ex: TTL_SECONDS });
    }
  } catch (error) {
    // Logging failure should never break chat
    console.error('Chat log error:', error);
  }
}
