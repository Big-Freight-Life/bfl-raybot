'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import Image from 'next/image';
import { colors } from '@/theme/tokens';

interface IconSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function IconSidebar({ open, onToggle }: IconSidebarProps) {
  return (
    <Box
      sx={{
        width: open ? 260 : 52,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Top row — logo + toggle, aligned with title bar height */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 49,
          px: open ? 1.5 : 0,
          justifyContent: open ? 'space-between' : 'center',
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        {/* Logo — always visible, centered */}
        <Box
          component="a"
          href="https://bfl.design"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: open ? 'auto' : '100%' }}
        >
          <Image
            src="/images/logo-teal.png"
            alt="Big Freight Life"
            width={20}
            height={20}
            style={{ display: 'block' }}
          />
        </Box>
        {open && (
          <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
            <ViewSidebarOutlinedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </Box>

      {/* Icons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: open ? 'flex-start' : 'center', py: 1, gap: 0.5, px: open ? 1 : 0 }}>
        {!open && (
          <Tooltip title="Open sidebar" placement="right">
            <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
              <ViewSidebarOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}
        <Tooltip title="New chat" placement="right" disableHoverListener={open}>
          <IconButton
            size="small"
            onClick={() => {
              sessionStorage.removeItem('raybot_history');
              window.location.reload();
            }}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, borderRadius: open ? '8px' : '50%', width: open ? '100%' : 'auto', justifyContent: 'flex-start', gap: 1.5, px: open ? 1.5 : 1 }}
          >
            <EditNoteIcon sx={{ fontSize: 20 }} />
            {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>New chat</Box>}
          </IconButton>
        </Tooltip>

        <Tooltip title="Search chats" placement="right" disableHoverListener={open}>
          <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, borderRadius: open ? '8px' : '50%', width: open ? '100%' : 'auto', justifyContent: 'flex-start', gap: 1.5, px: open ? 1.5 : 1 }}>
            <SearchIcon sx={{ fontSize: 20 }} />
            {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Search</Box>}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* User avatar at bottom */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, justifyContent: open ? 'flex-start' : 'center' }}>
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: colors.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          RB
        </Box>
        {open && <Box sx={{ fontSize: '0.8125rem', color: 'text.primary', fontWeight: 500, whiteSpace: 'nowrap' }}>Ray Butler</Box>}
      </Box>
    </Box>
  );
}
