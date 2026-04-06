export interface ChatSummary {
  id: string;
  title: string;
  timestamp: number;
  messageCount: number;
}

export interface SavedChat {
  id: string;
  title: string;
  timestamp: number;
  messages: { role: 'user' | 'bot'; content: string; source?: 'voice' | 'text'; timestamp?: number; caseStudyKey?: string }[];
}

const CHATS_KEY = 'raybot_chats';
const MAX_CHATS = 20;

export function getChatList(): ChatSummary[] {
  // M2: SSR guard — localStorage is not available on the server
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return [];
    const chats: SavedChat[] = JSON.parse(raw);
    return chats.map(({ id, title, timestamp, messages }) => ({
      id,
      title,
      timestamp,
      messageCount: messages.length,
    }));
  } catch {
    return [];
  }
}

export function saveChat(chat: SavedChat): void {
  // M2: SSR guard
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    const chats: SavedChat[] = raw ? JSON.parse(raw) : [];
    // Replace if same id exists, otherwise prepend
    const filtered = chats.filter((c) => c.id !== chat.id);
    filtered.unshift(chat);
    // Keep only recent chats
    localStorage.setItem(CHATS_KEY, JSON.stringify(filtered.slice(0, MAX_CHATS)));
  } catch { /* ignore */ }
}

export function loadChat(id: string): SavedChat | null {
  // M2: SSR guard
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return null;
    const chats: SavedChat[] = JSON.parse(raw);
    return chats.find((c) => c.id === id) ?? null;
  } catch {
    return null;
  }
}

export function deleteChat(id: string): void {
  // M2: SSR guard
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(CHATS_KEY);
    if (!raw) return;
    const chats: SavedChat[] = JSON.parse(raw);
    localStorage.setItem(CHATS_KEY, JSON.stringify(chats.filter((c) => c.id !== id)));
  } catch { /* ignore */ }
}

export function generateTitle(messages: { role: string; content: string }[]): string {
  const firstUser = messages.find((m) => m.role === 'user');
  if (!firstUser) return 'New chat';
  const text = firstUser.content.trim();
  return text.length > 40 ? text.slice(0, 40) + '...' : text;
}
