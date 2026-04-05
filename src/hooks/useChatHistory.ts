import { useCallback } from 'react';
import { STORAGE_KEY_HISTORY, MAX_MESSAGES_HISTORY } from '@/lib/constants';
import type { Message } from '@/types/chat';

export function useChatHistory() {
  const loadHistory = useCallback((): Message[] => {
    if (typeof window === 'undefined') return [];
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY_HISTORY);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }, []);

  const saveHistory = useCallback((messages: Message[]) => {
    try {
      const saveable = messages.filter((m) => !m.isThinking).slice(-MAX_MESSAGES_HISTORY);
      sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(saveable));
    } catch { /* ignore */ }
  }, []);

  return { loadHistory, saveHistory };
}
