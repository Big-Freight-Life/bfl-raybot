/** Shared chat types used across client and server */

/** Server-side message format (used with Gemini API) */
export interface ApiMessage {
  role: 'user' | 'model';
  content: string;
}

/** Client-side message format (used in UI components) */
export interface Message {
  role: 'user' | 'bot';
  content: string;
  isThinking?: boolean;
  source?: 'voice' | 'text';
  timestamp?: number;
}

/** Saved chat summary for sidebar list */
export interface ChatSummary {
  id: string;
  title: string;
  timestamp: number;
}

/** Full saved chat with messages */
export interface SavedChat extends ChatSummary {
  messages: Omit<Message, 'isThinking'>[];
}

/** KV log entry for a single message */
export interface LogEntry {
  role: 'user' | 'model';
  content: string;
  timestamp: string;
}

/** KV session log structure */
export interface SessionLog {
  sessionId: string;
  ipHash: string;
  createdAt: string;
  updatedAt: string;
  messages: LogEntry[];
}

/** Feedback type */
export type FeedbackType = 'helpful' | 'not_helpful';
