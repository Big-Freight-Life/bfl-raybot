'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import Image from 'next/image';

interface IconSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function IconSidebar({ open, onToggle }: IconSidebarProps) {
  if (!open) return null;

  return (
    <Box
      sx={{
        width: 260,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* Top row — logo + close toggle */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 49,
          px: 1.5,
          justifyContent: 'space-between',
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Box
          component="a"
          href="https://bfl.design"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <Image
            src="/images/logo-teal.png"
            alt="Big Freight Life"
            width={20}
            height={20}
            style={{ display: 'block' }}
          />
        </Box>
        <Tooltip title="Close sidebar">
          <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
            <ViewSidebarOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Nav items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', py: 1, gap: 0.5, px: 1 }}>
        <IconButton
          size="small"
          onClick={() => {
            sessionStorage.removeItem('raybot_history');
            window.location.reload();
          }}
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, borderRadius: '8px', width: '100%', justifyContent: 'flex-start', gap: 1.5, px: 1.5 }}
        >
          <EditNoteIcon sx={{ fontSize: 20 }} />
          <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>New chat</Box>
        </IconButton>

        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, borderRadius: '8px', width: '100%', justifyContent: 'flex-start', gap: 1.5, px: 1.5 }}>
          <SearchIcon sx={{ fontSize: 20 }} />
          <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Search</Box>
        </IconButton>
      </Box>
    </Box>
  );
}
