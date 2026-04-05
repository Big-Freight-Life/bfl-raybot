# Case Study Highlights Panel

## Overview

When a user clicks a case study in the sidebar, two things happen simultaneously: the full summary prompt fires into chat, and a highlights panel opens on the right side of the screen. The panel shows brief, tappable highlight sections for that case study. Tapping a highlight sends a scoped prompt into chat so Raybot explains that specific section in detail.

## Data Structure

Extend the existing `caseStudies` array in `IconSidebar.tsx` into a shared data file (`src/lib/case-studies.ts`) with highlights per study:

```ts
export interface CaseStudyHighlight {
  title: string;
  key: string;
}

export interface CaseStudy {
  title: string;
  key: string;
  summary: string; // one-liner shown in the panel header
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

## Prompt Generation

Each highlight generates a scoped prompt by combining the case study title with the highlight title:

- Full summary (on case study click): `"Tell me the story of the {title} case study."`  (existing behavior, unchanged)
- Highlight tap: `"Tell me about the {highlight title} in the {case study title} project."`

These are constructed at runtime from the data, not hardcoded per-highlight.

## Component: CaseStudyPanel

**File:** `src/components/CaseStudyPanel.tsx`

**Props:**
```ts
interface CaseStudyPanelProps {
  study: CaseStudy;
  onHighlightClick: (prompt: string) => void;
  onClose: () => void;
  visitedHighlights: Set<string>; // keys of highlights already tapped
}
```

**Layout:**
- Fixed width: 280px
- Header: case study title + summary one-liner + close (X) button
- Body: vertical list of highlight buttons
- Each button shows the highlight title; visited highlights get a muted/checked style
- Follows the same visual language as IconSidebar (same font sizes, colors, hover states)

**Styling:**
- `borderLeft: 1, borderColor: 'divider'`
- `bgcolor: 'background.paper'`
- Hidden on xs/sm breakpoints (`display: { xs: 'none', md: 'flex' }`)

## State Management (page.tsx)

New state in `Home` component:

```ts
const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);
const [visitedHighlights, setVisitedHighlights] = useState<Set<string>>(new Set());
```

**`handleNavigate` changes:**
- When action starts with `case-study:`, extract the key, set `activeCaseStudy` to that key, reset `visitedHighlights`, AND fire the full summary prompt (existing behavior preserved)
- Non-case-study actions: unchanged

**New handler `handleHighlightClick`:**
- Receives the constructed prompt string
- Fires it via `setTriggerMessage`
- Adds the highlight key to `visitedHighlights`

**Panel close:**
- Sets `activeCaseStudy` to null
- "New chat" action also clears `activeCaseStudy`

## Layout Changes

Current layout: `IconSidebar | MainArea(TopBar + Content(AvatarStage + ChatPanel))`

New layout: `IconSidebar | MainArea(TopBar + Content(AvatarStage + ChatPanel + CaseStudyPanel))`

The `CaseStudyPanel` renders conditionally when `activeCaseStudy` is set. ChatPanel continues to use `flex: 1` so it shrinks to accommodate the panel.

## IconSidebar Changes

- Import `caseStudies` from `src/lib/case-studies.ts` instead of the local `caseStudies` const
- No other changes needed; `onNavigate` already fires `case-study:{key}` actions

## Mobile

The panel is hidden on xs/sm breakpoints. Mobile users get the full summary in chat only. A future enhancement could show highlights as a horizontal chip bar above the chat input on mobile.

## Edge Cases

- Clicking a different case study while the panel is open: switches to the new study, resets visited highlights, fires new summary prompt
- Clicking the same case study while panel is open: no-op (don't re-fire the summary)
- Digital twin mode: panel closes (same as sidebar collapsing)
- New chat: clears `activeCaseStudy`
