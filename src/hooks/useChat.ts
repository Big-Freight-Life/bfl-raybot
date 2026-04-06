import { useState, useRef, useCallback } from 'react';
import { extractFirstMermaid } from '@/lib/mermaid-utils';
import { LEAD_FORM_TRIGGER } from '@/lib/constants';
import type { Message } from '@/types/chat';

interface UseChatOptions {
  sessionId: string;
  onDiagramDetected?: (code: string) => void;
  saveHistory: (messages: Message[]) => void;
  playTTS: (text: string) => void;
}

export function useChat({ sessionId, onDiagramDetected, saveHistory, playTTS }: UseChatOptions) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const stopResponse = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(async (text: string, source: 'voice' | 'text' = 'text') => {
    const now = Date.now();
    const userMsg: Message = { role: 'user', content: text, source, timestamp: now };
    const thinkingMsg: Message = { role: 'bot', content: '', isThinking: true };
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setIsProcessing(true);

    const apiMessages = [...messages.filter((m) => !m.isThinking), userMsg].map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      content: m.content,
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, sessionId }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      // Replace thinking msg with streaming bot msg
      setMessages((prev) => {
        const updated = prev.filter((m) => !m.isThinking);
        return [...updated, { role: 'bot' as const, content: '', timestamp: Date.now() }];
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'bot') {
            updated[updated.length - 1] = { ...last, content: current };
          }
          return updated;
        });
      }

      // Finalize
      const finalText = accumulated;
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === 'bot') {
          updated[updated.length - 1] = { role: 'bot', content: finalText, timestamp: last.timestamp ?? Date.now() };
        }
        saveHistory(updated);
        return updated;
      });

      const mermaidCode = extractFirstMermaid(finalText);
      if (mermaidCode && onDiagramDetected) onDiagramDetected(mermaidCode);

      if (LEAD_FORM_TRIGGER.test(finalText)) setShowLeadForm(true);
      playTTS(finalText);
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User stopped — keep whatever was streamed
        setMessages((prev) => {
          const updated = [...prev].filter((m) => !m.isThinking);
          saveHistory(updated);
          return updated;
        });
      } else {
        setMessages((prev) => {
          const updated = prev.filter((m) => !m.isThinking);
          return [...updated, { role: 'bot', content: (error as Error).message || 'Something went wrong.' }];
        });
      }
    } finally {
      setIsProcessing(false);
      abortRef.current = null;
    }
  }, [messages, sessionId, onDiagramDetected, saveHistory, playTTS]);

  return { messages, setMessages, isProcessing, sendMessage, stopResponse, showLeadForm };
}
