'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import type { CaseStudy } from '@/lib/case-studies';
import { softwareTools, agentSkills } from '@/lib/toolbox';

interface CaseStudyPanelProps {
  study: CaseStudy;
  onHighlightClick: (prompt: string) => void;
  onClose: () => void;
  visitedHighlights: Set<string>;
  variant?: 'default' | 'tabs';
}

/* ─── ToolboxTabContent sub-component ─── */

function ToolboxTabContent({ onItemClick }: { onItemClick: (prompt: string) => void }) {
  const [category, setCategory] = useState<'tools' | 'skills'>('tools');
  const items = category === 'tools' ? softwareTools : agentSkills;

  return (
    <Box sx={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'thin' }}>
      <Box sx={{ px: 2.5, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <RadioGroup
          row
          value={category}
          onChange={(e) => setCategory(e.target.value as 'tools' | 'skills')}
        >
          <FormControlLabel
            value="tools"
            control={<Radio size="small" sx={{ py: 0.5, '&.Mui-checked': { color: 'primary.main' } }} />}
            label={<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>Software Tools</Typography>}
          />
          <FormControlLabel
            value="skills"
            control={<Radio size="small" sx={{ py: 0.5, '&.Mui-checked': { color: 'primary.main' } }} />}
            label={<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>Agent Skills</Typography>}
          />
        </RadioGroup>
      </Box>
      <Box sx={{ px: 1.5, py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
        {items.map((item) => (
          <Box
            key={item.key}
            component="button"
            onClick={() => onItemClick(item.prompt)}
            sx={{
              display: 'block',
              px: 1.5,
              py: 1,
              borderRadius: '8px',
              fontSize: '0.8125rem',
              color: 'text.secondary',
              textAlign: 'left',
              border: 'none',
              bgcolor: 'transparent',
              cursor: 'pointer',
              width: '100%',
              fontFamily: 'inherit',
              '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
            }}
          >
            {item.title}
          </Box>
        ))}
      </Box>
    </Box>
  );
}

export default function CaseStudyPanel({
  study,
  onHighlightClick,
  onClose,
  visitedHighlights,
  variant = 'default',
}: CaseStudyPanelProps) {
  const isTabs = variant === 'tabs';
  const [activeTab, setActiveTab] = useState(study.highlights[0]?.key ?? '');
  const [caseView, setCaseView] = useState<'notes' | 'architecture'>('notes');
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const activeHighlight = isTabs
    ? study.highlights.find((h) => h.key === activeTab)
    : null;

  return (
    <Box
      sx={{
        width: 360,
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
          borderBottom: isTabs ? 0 : 1,
          borderColor: 'divider',
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, lineHeight: 1.3 }}
          >
            {isTabs ? study.title : 'More About Project'}
          </Typography>
          {!isTabs && (
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', display: 'block', mt: 0.5, lineHeight: 1.4 }}
            >
              {study.title}
            </Typography>
          )}
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

      {/* Tabs variant — horizontal tab bar + content */}
      {isTabs ? (
        <>
          <Box
            sx={{
              display: 'flex',
              borderBottom: 1,
              borderColor: 'divider',
              flexShrink: 0,
            }}
          >
            {study.highlights.map((highlight) => {
              const isActive = activeTab === highlight.key;
              return (
                <Box
                  key={highlight.key}
                  component="button"
                  onClick={() => setActiveTab(highlight.key)}
                  sx={{
                    flex: 1,
                    py: 1.25,
                    px: 1,
                    fontSize: '0.8125rem',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? 'primary.main' : 'text.secondary',
                    bgcolor: 'transparent',
                    border: 'none',
                    borderBottom: '2px solid',
                    borderBottomColor: isActive ? 'primary.main' : 'transparent',
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    transition: 'all 0.15s ease',
                    '&:hover': { color: 'primary.main', borderBottomColor: isActive ? 'primary.main' : 'action.hover' },
                  }}
                >
                  {highlight.title}
                </Box>
              );
            })}
          </Box>
          {/* Tab content */}
          {activeTab === 'toolbox' ? (
            <ToolboxTabContent onItemClick={onHighlightClick} />
          ) : activeHighlight?.content ? (
            <Box sx={{ flex: 1, overflowY: 'auto', px: 2.5, py: 2, scrollbarWidth: 'thin' }}>
              <Typography
                variant="body2"
                sx={{ color: 'text.secondary', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.8125rem' }}
              >
                {activeHighlight.content}
              </Typography>
            </Box>
          ) : null}
        </>
      ) : (
        /* Default variant — vertical list */
        <Box sx={{ px: 1.5, py: 1.5 }}>
          <RadioGroup
            row
            value={caseView}
            onChange={(e) => setCaseView(e.target.value as 'notes' | 'architecture')}
            sx={{ px: 0.5, mb: 1 }}
          >
            <FormControlLabel
              value="notes"
              control={<Radio size="small" sx={{ py: 0.5, '&.Mui-checked': { color: 'primary.main' } }} />}
              label={<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>Case Notes</Typography>}
            />
            <FormControlLabel
              value="architecture"
              control={<Radio size="small" sx={{ py: 0.5, '&.Mui-checked': { color: 'primary.main' } }} />}
              label={<Typography variant="body2" sx={{ fontSize: '0.8125rem' }}>Architecture</Typography>}
            />
          </RadioGroup>
          {caseView === 'architecture' ? (
            <Box sx={{ px: 1, py: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem', lineHeight: 1.6, textAlign: 'left', whiteSpace: 'pre-wrap' }}>
                {study.architecture || 'Architecture notes coming soon.'}
              </Typography>
            </Box>
          ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {study.highlights.map((highlight) => {
              const visited = visitedHighlights.has(highlight.key);
              const prompt = `Tell me about the ${highlight.title.toLowerCase()} in the ${study.title} project.`;
              const isExpanded = expandedKey === highlight.key;

              return (
                <Box key={highlight.key}>
                  <Box
                    onClick={() => setExpandedKey(isExpanded ? null : highlight.key)}
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
                      bgcolor: isExpanded ? 'action.hover' : 'transparent',
                      cursor: 'pointer',
                      width: '100%',
                      '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                      '&:hover .play-icon': { opacity: 1 },
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
                    <Box
                      component="button"
                      aria-label="Ask Raybot about this"
                      onClick={(e) => {
                        e.stopPropagation();
                        onHighlightClick(prompt);
                      }}
                      className="play-icon"
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: 'transparent',
                        color: 'text.secondary',
                        border: 'none',
                        cursor: 'pointer',
                        flexShrink: 0,
                        opacity: 0,
                        transition: 'all 0.2s ease',
                        '&:hover': { bgcolor: 'primary.main', color: '#fff' },
                      }}
                    >
                      <PlayArrowIcon sx={{ fontSize: 16 }} />
                    </Box>
                  </Box>
                  {isExpanded && (
                    <Box sx={{ px: 1.5, py: 1, fontSize: '0.8125rem', color: 'text.secondary', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {highlight.content || 'Notes coming soon.'}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
          )}
        </Box>
      )}
    </Box>
  );
}
