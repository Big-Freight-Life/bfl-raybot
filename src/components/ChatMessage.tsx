'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import ReplayIcon from '@mui/icons-material/Replay';
import { colors } from '@/theme/tokens';
import ThinkingDots from './ThinkingDots';
import { useState } from 'react';

interface ChatMessageProps {
  role: 'user' | 'bot';
  content: string;
  isThinking?: boolean;
  isTyping?: boolean;
  index: number;
  onRegenerate?: () => void;
}

export default function ChatMessage({ role, content, isThinking, isTyping, index, onRegenerate }: ChatMessageProps) {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      <Box sx={{ maxWidth: '85%' }}>
        <Box
          sx={{
            px: 2.5, py: 1.5,
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            bgcolor: isUser ? colors.chat.userBubble : colors.chat.botBubble,
            color: isUser ? colors.chat.userText : colors.chat.botText,
          }}
        >
          {isThinking ? (
            <ThinkingDots />
          ) : (
            <Typography
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
              {content}
              {isTyping && (
                <Box component="span" sx={{
                  display: 'inline-block', width: 2, height: '1em',
                  bgcolor: isUser ? '#fff' : colors.gray[900],
                  ml: '2px', verticalAlign: 'text-bottom',
                  animation: 'cursorBlink 1s step-end infinite',
                  '@keyframes cursorBlink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
                }} />
              )}
            </Typography>
          )}
        </Box>
        {!isUser && !isThinking && !isTyping && content && (
          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, pl: 1 }}>
            <Tooltip title={copied ? 'Copied!' : 'Copy'}>
              <IconButton size="small" onClick={handleCopy} sx={{ color: 'text.secondary' }}>
                <ContentCopyIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
            {onRegenerate && (
              <Tooltip title="Regenerate">
                <IconButton size="small" onClick={onRegenerate} sx={{ color: 'text.secondary' }}>
                  <ReplayIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Tooltip>
            )}
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
