'use client';

import { Box, Divider, IconButton, Tooltip, Typography } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import Image from 'next/image';
import { caseStudies } from '@/lib/case-studies';
import type { ChatSummary } from '@/lib/chat-history';

interface IconSidebarProps {
  open: boolean;
  onToggle: () => void;
  onNavigate?: (action: string) => void;
  onNewChat?: () => void;
  onLoadChat?: (chatId: string) => void;
  activeItem?: string | null;
  activeChatId?: string | null;
  chatList?: ChatSummary[];
}

const teal = '#117680';

export default function IconSidebar({ open, onToggle, onNavigate, onNewChat, onLoadChat, activeItem, activeChatId, chatList = [] }: IconSidebarProps) {
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
      {/* Top row */}
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
        {open ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
          </>
        ) : (
          <Tooltip title="Open sidebar" placement="right">
            <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
              <ViewSidebarOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Nav items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: open ? 'flex-start' : 'center', py: 1, gap: 0.5, px: open ? 1 : 0 }}>
        <Tooltip title="New chat" placement="right" disableHoverListener={open}>
          <IconButton
            size="small"
            onClick={onNewChat}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, borderRadius: open ? '8px' : '50%', width: open ? '100%' : 'auto', justifyContent: 'flex-start', gap: 1.5, px: open ? 1.5 : 1 }}
          >
            <EditNoteIcon sx={{ fontSize: 20 }} />
            {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>New chat</Box>}
          </IconButton>
        </Tooltip>

        <Tooltip title="Process" placement="right" disableHoverListener={open}>
          <IconButton
            size="small"
            onClick={() => onNavigate?.('process')}
            sx={{
              color: activeItem === 'process' ? teal : 'text.secondary',
              bgcolor: activeItem === 'process' ? `${teal}0F` : 'transparent',
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
              borderRadius: open ? '8px' : '50%', width: open ? '100%' : 'auto', justifyContent: 'flex-start', gap: 1.5, px: open ? 1.5 : 1,
            }}
          >
            <AccountTreeOutlinedIcon sx={{ fontSize: 20 }} />
            {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Process</Box>}
          </IconButton>
        </Tooltip>

        <Tooltip title="About Ray" placement="right" disableHoverListener={open}>
          <IconButton
            size="small"
            onClick={() => onNavigate?.('about-ray')}
            sx={{
              color: activeItem === 'about-ray' ? teal : 'text.secondary',
              bgcolor: activeItem === 'about-ray' ? `${teal}0F` : 'transparent',
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
              borderRadius: open ? '8px' : '50%', width: open ? '100%' : 'auto', justifyContent: 'flex-start', gap: 1.5, px: open ? 1.5 : 1,
            }}
          >
            <PersonOutlineIcon sx={{ fontSize: 20 }} />
            {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>About Ray</Box>}
          </IconButton>
        </Tooltip>

        <Tooltip title="Contact Us" placement="right" disableHoverListener={open}>
          <IconButton
            size="small"
            onClick={() => onNavigate?.('contact')}
            sx={{
              color: activeItem === 'contact' ? teal : 'text.secondary',
              bgcolor: activeItem === 'contact' ? `${teal}0F` : 'transparent',
              '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
              borderRadius: open ? '8px' : '50%', width: open ? '100%' : 'auto', justifyContent: 'flex-start', gap: 1.5, px: open ? 1.5 : 1,
            }}
          >
            <MailOutlineIcon sx={{ fontSize: 20 }} />
            {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Contact Us</Box>}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Case Studies section — only when expanded */}
      {open && (
        <Box sx={{ px: 1.5, mt: 1 }}>
          <Divider sx={{ mb: 1.5 }} />
          <Box sx={{ px: 0 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 1, px: 0.5 }}>
            Case Studies
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {caseStudies.map((study) => {
              const isActive = activeItem === `case-study:${study.key}`;
              return (
                <Box
                  key={study.key}
                  component="button"
                  onClick={() => onNavigate?.(`case-study:${study.key}`)}
                  sx={{
                    display: 'block',
                    px: 1.5,
                    py: 1,
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    color: isActive ? teal : 'text.secondary',
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    textAlign: 'left',
                    border: 'none',
                    bgcolor: isActive ? `${teal}0F` : 'transparent',
                    cursor: 'pointer',
                    width: '100%',
                    fontFamily: 'inherit',
                    '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                  }}
                >
                  {study.title}
                </Box>
              );
            })}
          </Box>
          </Box>
        </Box>
      )}

      {/* Chats section — only when expanded and has chats */}
      {open && chatList.length > 0 && (
        <Box sx={{ px: 1.5, mt: 3, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 1, px: 0.5, flexShrink: 0 }}>
              Chats
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, overflowY: 'auto', scrollbarWidth: 'thin', flex: 1 }}>
              {chatList.map((chat) => {
                const isActive = activeChatId === chat.id;
                return (
                  <Box
                    key={chat.id}
                    component="button"
                    onClick={() => onLoadChat?.(chat.id)}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      px: 1.5,
                      py: 1,
                      borderRadius: '8px',
                      fontSize: '0.8125rem',
                      color: isActive ? teal : 'text.secondary',
                      fontWeight: isActive ? 600 : 400,
                      textAlign: 'left',
                      border: 'none',
                      bgcolor: isActive ? `${teal}0F` : 'transparent',
                      cursor: 'pointer',
                      width: '100%',
                      fontFamily: 'inherit',
                      '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                    }}
                  >
                    <ChatBubbleOutlineIcon sx={{ fontSize: 14, flexShrink: 0, opacity: 0.6 }} />
                    <Box
                      component="span"
                      sx={{
                        flex: 1,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {chat.title}
                    </Box>
                  </Box>
                );
              })}
            </Box>
        </Box>
      )}
    </Box>
  );
}
