'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import DownloadIcon from '@mui/icons-material/Download';
import { colors } from '@/theme/tokens';
import ThinkingDots from './ThinkingDots';
import InlineDiagram from './InlineDiagram';
import { useState } from 'react';

function renderContent(text: string, isUser: boolean) {
  // Hide incomplete mermaid blocks (still streaming)
  const hasOpenMermaid = /```mermaid\n/.test(text) && !/```mermaid\n[\s\S]*?```/.test(text);
  const displayText = hasOpenMermaid
    ? text.replace(/```mermaid\n[\s\S]*$/, '').trimEnd()
    : text;

  const parts = displayText.split(/(```mermaid\n[\s\S]*?```)/g);
  return parts.map((part, i) => {
    const mermaidMatch = part.match(/```mermaid\n([\s\S]*?)```/);
    if (mermaidMatch) {
      return <InlineDiagram key={i} code={mermaidMatch[1].trim()} />;
    }
    if (!part.trim()) return null;
    return (
      <Typography
        key={i}
        variant="body2"
        sx={{
          lineHeight: 1.7, whiteSpace: 'pre-wrap',
          '& code': {
            fontFamily: "'SF Mono', monospace", fontSize: '0.8125rem',
            bgcolor: isUser ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.06)',
            px: 0.75, py: 0.25, borderRadius: '4px',
          },
        }}
      >
        {part}
      </Typography>
    );
  });
}

interface ChatMessageProps {
  role: 'user' | 'bot';
  content: string;
  isThinking?: boolean;
  isTyping?: boolean;
  index: number;
  source?: 'voice' | 'text';
}

export default function ChatMessage({ role, content, isThinking, isTyping, index, source }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `raybot-message-${index}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFeedback = async (type: 'helpful' | 'not_helpful') => {
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageIndex: index, feedback: type }),
      });
    } catch { /* silent */ }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', mb: 2, px: 1 }}>
      <Box sx={{ maxWidth: isUser ? '85%' : '100%', width: isUser ? 'auto' : '100%' }}>
        {source && (
          <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5, px: 1, color: 'text.disabled', fontSize: '0.65rem', justifyContent: isUser ? 'flex-end' : 'flex-start' }}>
            {source === 'voice' ? '🎙 Voice' : '⌨ Text'}
          </Typography>
        )}
        <Box
          sx={{
            px: 2.5, py: 1.5,
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            bgcolor: isUser ? colors.chat.userBubble : 'transparent',
            color: isUser ? 'text.primary' : colors.chat.botText,
          }}
        >
          {isThinking ? (
            <ThinkingDots />
          ) : (
            <>
            {renderContent(content, isUser)}
            {isTyping && (
              <Box component="span" sx={{
                display: 'inline-block', width: 2, height: '1em',
                bgcolor: isUser ? '#fff' : colors.gray[900],
                ml: '2px', verticalAlign: 'text-bottom',
                animation: 'cursorBlink 1s step-end infinite',
                '@keyframes cursorBlink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
              }} />
            )}
            </>
          )}
        </Box>
        {!isUser && !isThinking && !isTyping && content && (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, pl: 1 }}>
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
              <IconButton size="small" onClick={handleCopy} sx={{ color: 'text.secondary' }}>
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton size="small" onClick={handleDownload} sx={{ color: 'text.secondary' }}>
                <DownloadIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Helpful">
              <IconButton size="small" onClick={() => handleFeedback('helpful')} sx={{ color: 'text.secondary' }}>
                <ThumbUpOffAltIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Not helpful">
              <IconButton size="small" onClick={() => handleFeedback('not_helpful')} sx={{ color: 'text.secondary' }}>
                <ThumbDownOffAltIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );
}
