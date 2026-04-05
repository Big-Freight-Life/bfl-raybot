import { useRef, useEffect, useCallback, useState } from 'react';
import { stripMermaidBlocks } from '@/lib/mermaid-utils';

interface UseAudioPlayerOptions {
  voiceMuted: boolean;
  digitalTwinMode?: boolean;
  onSpeakingChange?: (speaking: boolean) => void;
}

export function useAudioPlayer({ voiceMuted, digitalTwinMode, onSpeakingChange }: UseAudioPlayerOptions) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        if (audioRef.current.src) {
          URL.revokeObjectURL(audioRef.current.src);
        }
        audioRef.current = null;
      }
    };
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setIsSpeaking(false);
    onSpeakingChange?.(false);
  }, [onSpeakingChange]);

  const playTTS = useCallback(async (text: string) => {
    if (voiceMuted && !digitalTwinMode) return;
    try {
      setIsSpeaking(true);
      onSpeakingChange?.(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: stripMermaidBlocks(text) }),
      });
      if (!res.ok) {
        setIsSpeaking(false);
        onSpeakingChange?.(false);
        return;
      }
      const { audio } = await res.json();
      const audioBlob = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0));
      const blob = new Blob([audioBlob], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.pause();
      const player = new Audio(url);
      audioRef.current = player;
      player.onended = () => {
        URL.revokeObjectURL(url);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };
      player.onerror = () => {
        URL.revokeObjectURL(url);
        setIsSpeaking(false);
        onSpeakingChange?.(false);
      };
      player.play();
    } catch {
      setIsSpeaking(false);
      onSpeakingChange?.(false);
    }
  }, [voiceMuted, digitalTwinMode, onSpeakingChange]);

  return { playTTS, stopAudio, isSpeaking, audioRef };
}
