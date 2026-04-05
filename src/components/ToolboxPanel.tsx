'use client';

import { useState } from 'react';
import { Box, Typography, IconButton, Tooltip, Radio, RadioGroup, FormControlLabel } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { softwareTools, agentSkills } from '@/lib/toolbox';

type ToolboxTab = 'tools' | 'skills';

interface ToolboxPanelProps {
  onItemClick: (prompt: string) => void;
  onClose: () => void;
  activeItemKey?: string | null;
}

export default function ToolboxPanel({ onItemClick, onClose, activeItemKey }: ToolboxPanelProps) {
  const [tab, setTab] = useState<ToolboxTab>('tools');
  const items = tab === 'tools' ? softwareTools : agentSkills;

  return (
    <Box
      sx={{
        width: 300,
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
          <Typography variant="subtitle2" sx={{ fontWeight: 700, fontSize: '0.875rem', lineHeight: 1.3 }}>
            Toolbox
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5, lineHeight: 1.4 }}>
            Software tools and agent skills
          </Typography>
        </Box>
        <Tooltip title="Close panel">
          <IconButton size="small" onClick={onClose} sx={{ color: 'text.secondary', ml: 1, mt: -0.5 }}>
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Radio selector */}
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <RadioGroup
          value={tab}
          onChange={(e) => setTab(e.target.value as ToolboxTab)}
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

      {/* Items list */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 1.5, py: 1.5, scrollbarWidth: 'thin' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
          {items.map((item) => {
            const isActive = activeItemKey === item.key;
            return (
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
                  color: isActive ? 'primary.main' : 'text.secondary',
                  fontWeight: isActive ? 600 : 400,
                  textAlign: 'left',
                  border: 'none',
                  bgcolor: isActive ? 'action.selected' : 'transparent',
                  cursor: 'pointer',
                  width: '100%',
                  fontFamily: 'inherit',
                  '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                }}
              >
                {item.title}
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}
