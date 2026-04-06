'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import ThumbDownOffAltIcon from '@mui/icons-material/ThumbDownOffAlt';
import DownloadIcon from '@mui/icons-material/Download';
import { colors } from '@/theme/tokens';
import ThinkingDots from './ThinkingDots';
import InlineDiagram from './InlineDiagram';
import CaseStudyPresentation from './CaseStudyPresentation';
import { AboutRayPresentation, ProcessPresentation, ContactPresentation } from './InfoPresentations';
import { useState } from 'react';
import { splitContentByMermaid } from '@/lib/mermaid-utils';
import { findCaseStudyByKey } from '@/lib/case-studies';

function renderContent(text: string, isUser: boolean) {
  const segments = splitContentByMermaid(text);
  return segments.map((segment, i) => {
    if (segment.type === 'mermaid') {
      return <InlineDiagram key={i} code={segment.content} />;
    }
    return (
      <Typography
        key={i}
        variant="body2"
        sx={{
          lineHeight: 1.7, whiteSpace: 'pre-wrap',
          '& code': {
            fontFamily: "'SF Mono', monospace", fontSize: '0.8125rem',
            bgcolor: isUser ? 'rgba(255,255,255,0.15)' : 'action.hover',
            px: 0.75, py: 0.25, borderRadius: '4px',
          },
        }}
      >
        {segment.content}
      </Typography>
    );
  });
}

/* ─── MessageActions sub-component ─── */

interface MessageActionsProps {
  content: string;
  index: number;
}

function MessageActions({ content, index }: MessageActionsProps) {
  const [copied, setCopied] = useState(false);

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
    <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5, pl: 0 }}>
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
  );
}

/* ─── ChatMessage component ─── */

interface ChatMessageProps {
  role: 'user' | 'bot';
  content: string;
  isThinking?: boolean;
  isTyping?: boolean;
  index: number;
  source?: 'voice' | 'text';
  caseStudyKey?: string;
  timestamp?: number;
}

export default function ChatMessage({ role, content, isThinking, isTyping, index, source, caseStudyKey, timestamp }: ChatMessageProps) {
  const isUser = role === 'user';
  const caseStudy = caseStudyKey ? findCaseStudyByKey(caseStudyKey) : null;

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
            px: isUser ? 2.5 : 0, py: 1.5,
            borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
            bgcolor: isUser ? (theme => theme.palette.mode === 'dark' ? 'rgba(45,212,191,0.10)' : colors.chat.userBubble) : 'transparent',
            color: 'text.primary',
          }}
        >
          {isThinking ? (
            <ThinkingDots />
          ) : caseStudyKey === 'about-ray' ? (
            <AboutRayPresentation timestamp={timestamp} />
          ) : caseStudyKey === 'process' ? (
            <ProcessPresentation timestamp={timestamp} />
          ) : caseStudyKey === 'contact' ? (
            <ContactPresentation timestamp={timestamp} />
          ) : caseStudy ? (
            <CaseStudyPresentation study={caseStudy} />
          ) : (
            <>
            {renderContent(content, isUser)}
            {isTyping && (
              <Box component="span" sx={{
                display: 'inline-block', width: 2, height: '1em',
                bgcolor: 'text.primary',
                ml: '2px', verticalAlign: 'text-bottom',
                animation: 'cursorBlink 1s step-end infinite',
                '@keyframes cursorBlink': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0 } },
              }} />
            )}
            </>
          )}
        </Box>
        {!isUser && !isThinking && !isTyping && content && (
          <MessageActions content={content} index={index} />
        )}
      </Box>
    </Box>
  );
}
