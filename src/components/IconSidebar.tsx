'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import SearchIcon from '@mui/icons-material/Search';
import Image from 'next/image';
import { colors } from '@/theme/tokens';

export default function IconSidebar() {
  return (
    <Box
      sx={{
        width: 60,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        alignItems: 'center',
        py: 2,
        gap: 1,
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      {/* BFL Logo */}
      <Tooltip title="Big Freight Life" placement="right">
        <Box
          component="a"
          href="https://bfl.design"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            mb: 1,
          }}
        >
          <Image
            src="/images/logo-teal.png"
            alt="Big Freight Life"
            width={28}
            height={28}
            style={{ display: 'block' }}
          />
        </Box>
      </Tooltip>

      {/* New chat */}
      <Tooltip title="New chat" placement="right">
        <IconButton
          size="small"
          onClick={() => {
            sessionStorage.removeItem('raybot_history');
            window.location.reload();
          }}
          sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}
        >
          <EditNoteIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Tooltip>

      {/* Search */}
      <Tooltip title="Search chats" placement="right">
        <IconButton size="small" sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' } }}>
          <SearchIcon sx={{ fontSize: 22 }} />
        </IconButton>
      </Tooltip>

      {/* Spacer */}
      <Box sx={{ flex: 1 }} />

      {/* User avatar at bottom */}
      <Tooltip title="Ray Butler" placement="right">
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            bgcolor: colors.primary.main,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          RB
        </Box>
      </Tooltip>
    </Box>
  );
}
