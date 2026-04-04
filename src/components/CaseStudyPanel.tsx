'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { CaseStudy } from '@/lib/case-studies';

interface CaseStudyPanelProps {
  study: CaseStudy;
  onHighlightClick: (prompt: string) => void;
  onClose: () => void;
  visitedHighlights: Set<string>;
}

export default function CaseStudyPanel({
  study,
  onHighlightClick,
  onClose,
  visitedHighlights,
}: CaseStudyPanelProps) {
  return (
    <Box
      sx={{
        width: 280,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderLeft: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            sx={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.3 }}
          >
            {study.title}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: 'text.secondary', display: 'block', mt: 0.5, lineHeight: 1.4 }}
          >
            {study.summary}
          </Typography>
        </Box>
        <Tooltip title="Close panel">
          <IconButton
            size="small"
            onClick={onClose}
            sx={{ color: 'text.secondary', ml: 1, mt: -0.5 }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Highlights */}
      <Box sx={{ px: 1.5, py: 1.5 }}>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'block',
            mb: 1,
            px: 0.5,
          }}
        >
          Highlights
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {study.highlights.map((highlight) => {
            const visited = visitedHighlights.has(highlight.key);
            const prompt = `Tell me about the ${highlight.title.toLowerCase()} in the ${study.title} project.`;

            return (
              <Box
                key={highlight.key}
                component="button"
                onClick={() => onHighlightClick(prompt)}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  px: 1.5,
                  py: 1,
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  color: visited ? 'text.disabled' : 'text.secondary',
                  textAlign: 'left',
                  border: 'none',
                  bgcolor: 'transparent',
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: 'inherit',
                  '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                }}
              >
                {visited && (
                  <CheckCircleOutlineIcon
                    sx={{ fontSize: 16, color: 'text.disabled', flexShrink: 0 }}
                  />
                )}
                <Box component="span" sx={{ flex: 1 }}>
                  {highlight.title}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
