# Case Study Highlights Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a right-side panel that shows tappable highlight sections when a case study is selected, driving scoped prompts into the chat.

**Architecture:** Static case study data with highlights moves to a shared module. A new `CaseStudyPanel` component renders conditionally on the right side of the layout. Page-level state tracks which case study is active and which highlights have been visited.

**Tech Stack:** React, MUI 6, TypeScript

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `src/lib/case-studies.ts` | Case study data + types (shared by sidebar and panel) |
| Create | `src/components/CaseStudyPanel.tsx` | Right-side highlights panel component |
| Modify | `src/components/IconSidebar.tsx` | Import case studies from shared module instead of local const |
| Modify | `src/app/page.tsx` | Add state, handlers, layout changes, wire up panel |

---

### Task 1: Create shared case study data module

**Files:**
- Create: `src/lib/case-studies.ts`

- [ ] **Step 1: Create the data file**

```ts
// src/lib/case-studies.ts

export interface CaseStudyHighlight {
  title: string;
  key: string;
}

export interface CaseStudy {
  title: string;
  key: string;
  summary: string;
  highlights: CaseStudyHighlight[];
}

export const caseStudies: CaseStudy[] = [
  {
    title: 'Hyland OnBase Integration',
    key: 'hyland-onbase',
    summary: 'Enterprise content management integration for document-heavy workflows.',
    highlights: [
      { title: 'The Challenge', key: 'challenge' },
      { title: 'Architecture', key: 'architecture' },
      { title: 'AI Integration', key: 'ai-integration' },
      { title: 'Results', key: 'results' },
      { title: 'Lessons Learned', key: 'lessons' },
    ],
  },
  {
    title: 'Hyland for Workday',
    key: 'hyland-workday',
    summary: 'Connecting Hyland content services with Workday HR and finance workflows.',
    highlights: [
      { title: 'The Challenge', key: 'challenge' },
      { title: 'Architecture', key: 'architecture' },
      { title: 'AI Integration', key: 'ai-integration' },
      { title: 'Results', key: 'results' },
      { title: 'Lessons Learned', key: 'lessons' },
    ],
  },
  {
    title: 'Salesforce Migration',
    key: 'salesforce-migration',
    summary: 'Large-scale CRM migration with data integrity and workflow preservation.',
    highlights: [
      { title: 'The Challenge', key: 'challenge' },
      { title: 'Architecture', key: 'architecture' },
      { title: 'AI Integration', key: 'ai-integration' },
      { title: 'Results', key: 'results' },
      { title: 'Lessons Learned', key: 'lessons' },
    ],
  },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors related to `src/lib/case-studies.ts`

- [ ] **Step 3: Commit**

```bash
git add src/lib/case-studies.ts
git commit -m "feat: add shared case study data module with highlights"
```

---

### Task 2: Update IconSidebar to use shared data

**Files:**
- Modify: `src/components/IconSidebar.tsx`

- [ ] **Step 1: Replace local caseStudies const with import**

Remove the local `caseStudies` array (lines 9-13) and add an import at the top:

```ts
import { caseStudies } from '@/lib/case-studies';
```

Remove these lines:
```ts
const caseStudies = [
  { title: 'Hyland OnBase Integration', key: 'hyland-onbase' },
  { title: 'Hyland for Workday', key: 'hyland-workday' },
  { title: 'Salesforce Migration', key: 'salesforce-migration' },
];
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors. The `caseStudies` array shape is a superset of what IconSidebar uses (it only accesses `.title` and `.key`).

- [ ] **Step 3: Commit**

```bash
git add src/components/IconSidebar.tsx
git commit -m "refactor: use shared case study data in IconSidebar"
```

---

### Task 3: Create CaseStudyPanel component

**Files:**
- Create: `src/components/CaseStudyPanel.tsx`

- [ ] **Step 1: Create the component**

```tsx
// src/components/CaseStudyPanel.tsx
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
```

- [ ] **Step 2: Verify TypeScript compiles**

Run: `npx tsc --noEmit --pretty 2>&1 | head -20`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/CaseStudyPanel.tsx
git commit -m "feat: add CaseStudyPanel component with highlights"
```

---

### Task 4: Wire up state and layout in page.tsx

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Add imports**

Add at the top of the file:

```ts
import CaseStudyPanel from '@/components/CaseStudyPanel';
import { caseStudies } from '@/lib/case-studies';
```

- [ ] **Step 2: Add state variables**

After the existing `triggerMessage` state, add:

```ts
const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);
const [visitedHighlights, setVisitedHighlights] = useState<Set<string>>(new Set());
```

- [ ] **Step 3: Update handleNavigate**

Replace the existing `handleNavigate` callback with:

```ts
const handleNavigate = useCallback((action: string) => {
  if (action.startsWith('case-study:')) {
    const key = action.replace('case-study:', '');
    // Don't re-fire if same case study is already active
    if (key === activeCaseStudy) return;
    setActiveCaseStudy(key);
    setVisitedHighlights(new Set());
    const study = caseStudies.find((s) => s.key === key);
    if (study) {
      setTriggerMessage(`Tell me the story of the ${study.title} case study.`);
    }
    return;
  }

  const prompts: Record<string, string> = {
    'process': 'Tell me about the Big Freight Life process — how do you work with clients?',
    'about-ray': 'Tell me about Ray Butler — his background, expertise, and what he does at Big Freight Life.',
    'contact': 'I would like to get in touch — how can I contact Big Freight Life or schedule a call?',
  };
  const msg = prompts[action];
  if (msg) setTriggerMessage(msg);
}, [activeCaseStudy]);
```

- [ ] **Step 4: Add highlight click handler**

After `handleNavigate`, add:

```ts
const handleHighlightClick = useCallback((prompt: string) => {
  setTriggerMessage(prompt);
}, []);

const handleHighlightVisit = useCallback((key: string) => {
  setVisitedHighlights((prev) => new Set(prev).add(key));
}, []);
```

- [ ] **Step 5: Update new chat to clear active case study**

In the `IconSidebar` new chat handler, the component calls `sessionStorage.removeItem` and reloads, so `activeCaseStudy` resets naturally on reload. No change needed.

- [ ] **Step 6: Close panel in digital twin mode**

Update the `toggleDigitalTwin` callback. In the `if (!digitalTwinMode)` branch, add `setActiveCaseStudy(null);`:

```ts
const toggleDigitalTwin = useCallback(() => {
  if (!digitalTwinMode) {
    setSidebarOpen(false);
    setActiveCaseStudy(null);
    setDigitalTwinMode(true);
  } else {
    setSidebarOpen(true);
    setDigitalTwinMode(false);
    setMicActive(false);
  }
}, [digitalTwinMode]);
```

- [ ] **Step 7: Add CaseStudyPanel to layout**

Inside the `{/* Main content area */}` Box (the one with `flex: 1, display: 'flex', overflow: 'hidden'`), after the ChatPanel wrapper Box, add the panel. Also need to update the `onHighlightClick` to call both the prompt and the visit tracker.

Find the active study object for the panel:

```tsx
{(() => {
  const activeStudy = activeCaseStudy
    ? caseStudies.find((s) => s.key === activeCaseStudy)
    : null;
  return activeStudy ? (
    <CaseStudyPanel
      study={activeStudy}
      onHighlightClick={(prompt) => {
        handleHighlightClick(prompt);
        const highlight = activeStudy.highlights.find((h) =>
          prompt.includes(h.title.toLowerCase())
        );
        if (highlight) handleHighlightVisit(highlight.key);
      }}
      onClose={() => setActiveCaseStudy(null)}
      visitedHighlights={visitedHighlights}
    />
  ) : null;
})()}
```

- [ ] **Step 8: Verify build**

Run: `npx next build 2>&1 | tail -20`
Expected: Build succeeds with no errors

- [ ] **Step 9: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: wire up CaseStudyPanel with state and layout"
```

---

### Task 5: Clean up unused DiagramSidebar

**Files:**
- Delete: `src/components/DiagramSidebar.tsx` (not wired into page, replaced by inline diagrams in chat)

- [ ] **Step 1: Verify DiagramSidebar is not imported anywhere**

Run: `grep -r "DiagramSidebar" src/ --include="*.tsx" --include="*.ts"`
Expected: Only `src/components/DiagramSidebar.tsx` itself matches (no imports elsewhere)

- [ ] **Step 2: Delete the file**

```bash
rm src/components/DiagramSidebar.tsx
```

- [ ] **Step 3: Verify build still passes**

Run: `npx next build 2>&1 | tail -10`
Expected: Build succeeds

- [ ] **Step 4: Commit**

```bash
git add src/components/DiagramSidebar.tsx
git commit -m "chore: remove unused DiagramSidebar component"
```

---

### Task 6: Deploy and verify

- [ ] **Step 1: Push to remote**

```bash
git push origin main
```

- [ ] **Step 2: Deploy to production**

```bash
vercel deploy --prod
```

- [ ] **Step 3: Verify in browser**

1. Open https://bfl-raybot.vercel.app
2. Click a case study in the left sidebar
3. Verify: full summary appears in chat AND highlights panel opens on right
4. Click a highlight in the panel
5. Verify: scoped prompt fires into chat and highlight shows visited state
6. Click X on panel — verify it closes
7. Click a different case study — verify panel switches and visited state resets
