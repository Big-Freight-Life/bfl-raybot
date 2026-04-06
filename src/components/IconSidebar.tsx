'use client';

import { useState, type ReactNode } from 'react';
import { Box, Divider, Drawer, IconButton, Tooltip, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Image from 'next/image';
import { caseStudies } from '@/lib/case-studies';
import { SIDEBAR_WIDTH_COLLAPSED, SIDEBAR_WIDTH_EXPANDED } from '@/lib/constants';
import type { ChatSummary } from '@/lib/chat-history';

/* ─── Chat grouping helpers ─── */

interface ChatGroup {
  label: string;
  chats: ChatSummary[];
}

function groupChatsByDate(chats: ChatSummary[]): ChatGroup[] {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startOfYesterday = startOfToday - 24 * 60 * 60 * 1000;
  const sevenDaysAgo = startOfToday - 7 * 24 * 60 * 60 * 1000;
  const thirtyDaysAgo = startOfToday - 30 * 24 * 60 * 60 * 1000;

  const today: ChatSummary[] = [];
  const yesterday: ChatSummary[] = [];
  const previous7: ChatSummary[] = [];
  const previous30: ChatSummary[] = [];
  const older: Record<string, ChatSummary[]> = {};
  const olderOrder: string[] = [];

  // Sort newest first
  const sorted = [...chats].sort((a, b) => b.timestamp - a.timestamp);

  for (const chat of sorted) {
    const ts = chat.timestamp;
    if (ts >= startOfToday) {
      today.push(chat);
    } else if (ts >= startOfYesterday) {
      yesterday.push(chat);
    } else if (ts >= sevenDaysAgo) {
      previous7.push(chat);
    } else if (ts >= thirtyDaysAgo) {
      previous30.push(chat);
    } else {
      const d = new Date(ts);
      const label = d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
      if (!older[label]) {
        older[label] = [];
        olderOrder.push(label);
      }
      older[label].push(chat);
    }
  }

  const groups: ChatGroup[] = [];
  if (today.length) groups.push({ label: 'Today', chats: today });
  if (yesterday.length) groups.push({ label: 'Yesterday', chats: yesterday });
  if (previous7.length) groups.push({ label: 'Previous 7 Days', chats: previous7 });
  if (previous30.length) groups.push({ label: 'Previous 30 Days', chats: previous30 });
  for (const label of olderOrder) {
    groups.push({ label, chats: older[label] });
  }
  return groups;
}

interface IconSidebarProps {
  open: boolean;
  onToggle: () => void;
  onNavigate?: (action: string) => void;
  onNewChat?: () => void;
  onLoadChat?: (chatId: string) => void;
  activeItem?: string | null;
  activeChatId?: string | null;
  chatList?: ChatSummary[];
  isNewChatActive?: boolean;
}

/* ─── NavButton sub-component ─── */

interface NavButtonProps {
  tooltip: string;
  icon: ReactNode;
  label?: string;
  open: boolean;
  isActive?: boolean;
  onClick: () => void;
}

function NavButton({ tooltip, icon, label, open, isActive, onClick }: NavButtonProps) {
  return (
    <Tooltip title={tooltip} placement="right" disableHoverListener={open}>
      <IconButton
        size="small"
        onClick={onClick}
        sx={{
          color: isActive ? 'primary.main' : 'text.secondary',
          bgcolor: isActive ? 'action.selected' : 'transparent',
          '&:hover': { color: 'text.primary', bgcolor: 'action.hover' },
          borderRadius: open ? '8px' : '50%',
          width: open ? '100%' : 'auto',
          justifyContent: 'flex-start',
          gap: 1.5,
          px: open ? 1.5 : 1,
        }}
      >
        {icon}
        {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>{label || tooltip}</Box>}
      </IconButton>
    </Tooltip>
  );
}

/* ─── SidebarItemButton sub-component ─── */

interface SidebarItemButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: ReactNode;
  icon?: ReactNode;
}

function SidebarItemButton({ isActive, onClick, children, icon }: SidebarItemButtonProps) {
  return (
    <Box
      component="button"
      onClick={onClick}
      sx={{
        display: icon ? 'flex' : 'block',
        alignItems: icon ? 'center' : undefined,
        gap: icon ? 1 : undefined,
        px: 1.5,
        py: 1,
        borderRadius: '8px',
        fontSize: '0.8125rem',
        color: isActive ? 'primary.main' : 'text.secondary',
        fontWeight: isActive ? 600 : 400,
        textDecoration: 'none',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        textAlign: 'left',
        border: 'none',
        bgcolor: isActive ? 'action.selected' : 'transparent',
        cursor: 'pointer',
        width: '100%',
        fontFamily: 'inherit',
        '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
      }}
    >
      {icon}
      {children}
    </Box>
  );
}

// Shared sidebar content used by both desktop sidebar and mobile drawer
function SidebarContent({ open, onToggle, onNavigate, onNewChat, onLoadChat, activeItem, activeChatId, chatList = [], isNewChatActive, onMobileClose }: IconSidebarProps & { onMobileClose?: () => void }) {
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});
  const handleNavigate = (action: string) => {
    onNavigate?.(action);
    onMobileClose?.();
  };
  const handleNewChat = () => {
    onNewChat?.();
    onMobileClose?.();
  };
  const handleLoadChat = (chatId: string) => {
    onLoadChat?.(chatId);
    onMobileClose?.();
  };

  return (
    <>
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
              <IconButton size="small" onClick={onMobileClose || onToggle} sx={{ color: 'text.secondary' }}>
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
        <NavButton
          tooltip="New chat"
          icon={<EditNoteIcon sx={{ fontSize: 20 }} />}
          label="New chat"
          open={open}
          isActive={isNewChatActive}
          onClick={handleNewChat}
        />
        <NavButton
          tooltip="Process"
          icon={<AccountTreeOutlinedIcon sx={{ fontSize: 20 }} />}
          label="Process"
          open={open}
          isActive={activeItem === 'process'}
          onClick={() => handleNavigate('process')}
        />
        <NavButton
          tooltip="About Ray"
          icon={<PersonOutlineIcon sx={{ fontSize: 20 }} />}
          label="About Ray"
          open={open}
          isActive={activeItem === 'about-ray'}
          onClick={() => handleNavigate('about-ray')}
        />
        <NavButton
          tooltip="Contact Us"
          icon={<MailOutlineIcon sx={{ fontSize: 20 }} />}
          label="Contact Us"
          open={open}
          isActive={activeItem === 'contact'}
          onClick={() => handleNavigate('contact')}
        />
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
                <SidebarItemButton
                  key={study.key}
                  isActive={isActive}
                  onClick={() => handleNavigate(`case-study:${study.key}`)}
                >
                  {study.title}
                </SidebarItemButton>
              );
            })}
          </Box>
          </Box>
        </Box>
      )}

      {/* Chats section — grouped by date bucket */}
      {open && chatList.length > 0 && (
        <Box sx={{ px: 1.5, mt: 3, flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, overflowY: 'auto', scrollbarWidth: 'thin', flex: 1 }}>
            {groupChatsByDate(chatList).map((group) => {
              const isExpanded = expandedGroups[group.label] ?? false;
              return (
                <Box key={group.label}>
                  <Box
                    component="button"
                    onClick={() =>
                      setExpandedGroups((prev) => ({ ...prev, [group.label]: !isExpanded }))
                    }
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.25,
                      width: '100%',
                      border: 'none',
                      bgcolor: 'transparent',
                      cursor: 'pointer',
                      px: 0.5,
                      py: 0.25,
                      mb: 0.5,
                      borderRadius: '4px',
                      textAlign: 'left',
                      fontFamily: 'inherit',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                  >
                    {isExpanded ? (
                      <ExpandLessIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    ) : (
                      <ExpandMoreIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                    )}
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'text.secondary',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {group.label}
                    </Typography>
                  </Box>
                  {isExpanded && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      {group.chats.map((chat) => {
                        const isActive = activeChatId === chat.id && !activeItem;
                        return (
                          <SidebarItemButton
                            key={chat.id}
                            isActive={isActive}
                            onClick={() => handleLoadChat(chat.id)}
                            icon={<ChatBubbleOutlineIcon sx={{ fontSize: 14, flexShrink: 0, opacity: 0.6, mt: 0.25 }} />}
                          >
                            <Box component="span" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {chat.title}
                            </Box>
                          </SidebarItemButton>
                        );
                      })}
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      )}
    </>
  );
}

export default function IconSidebar(props: IconSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* I6: Mobile hamburger button — visible only on xs/sm */}
      <IconButton
        onClick={() => setMobileOpen(true)}
        sx={{
          display: { xs: 'flex', md: 'none' },
          position: 'fixed',
          top: 8,
          left: 8,
          zIndex: 1300,
          color: 'text.secondary',
          bgcolor: 'background.paper',
          border: 1,
          borderColor: 'divider',
          '&:hover': { bgcolor: 'action.hover' },
        }}
        size="small"
        aria-label="Open navigation menu"
      >
        <MenuIcon sx={{ fontSize: 22 }} />
      </IconButton>

      {/* I6: Mobile drawer overlay */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH_EXPANDED,
            bgcolor: 'background.paper',
          },
        }}
      >
        <SidebarContent
          {...props}
          open={true}
          onMobileClose={() => setMobileOpen(false)}
        />
      </Drawer>

      {/* Desktop sidebar — hidden on xs/sm */}
      <Box
        sx={{
          width: props.open ? SIDEBAR_WIDTH_EXPANDED : SIDEBAR_WIDTH_COLLAPSED,
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
        <SidebarContent {...props} />
      </Box>
    </>
  );
}
