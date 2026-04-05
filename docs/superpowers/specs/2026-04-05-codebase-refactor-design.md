# Codebase Refactor & Test Coverage

## Goal
Clean up, modularize, and add tests to the Raybot codebase for long-term maintainability.

## Phase 1: Extract Utilities & Constants (Foundation)

### 1.1 `src/lib/constants.ts`
Centralize all hardcoded values:
- Storage keys: `STORAGE_KEY`, `SESSION_ID_KEY`, `EMAIL_KEY`
- Limits: `MAX_MESSAGES`, `MAX_TEXT_LENGTH`, `MAX_TTS_LENGTH`, `SESSION_ID_MAX_LENGTH`
- Rate limits: `CHAT_RATE_LIMIT`, `TTS_RATE_LIMIT`, `LEAD_RATE_LIMIT`, `FEEDBACK_RATE_LIMIT`, `EMAIL_VERIFY_RATE_LIMIT`
- Theme: `SIDEBAR_WIDTH_COLLAPSED`, `SIDEBAR_WIDTH_EXPANDED`, `TEAL` (import from tokens.ts if exists)
- Model config: `GEMINI_MODEL`, `GEMINI_MAX_TOKENS`, `GEMINI_TEMPERATURE`
- TTL: `CHAT_LOG_TTL_SECONDS`, `CHAT_LOG_MAX_MESSAGES`

### 1.2 `src/lib/sanitization.ts`
Unified sanitization (currently duplicated in chat/route.ts and lead/route.ts):
- `stripHtml(text: string): string`
- `sanitizeMessage(text: string, maxLength?: number): string`
- `sanitizeEmail(email: string): string`

### 1.3 `src/lib/validators.ts`
Centralize validation (currently scattered across routes):
- `validateSessionId(id: string): boolean`
- `validateEmail(email: string): { valid: boolean; reason?: string }`
- `EMAIL_REGEX` — single source of truth
- `SESSION_ID_REGEX` — single source of truth

### 1.4 `src/lib/ip-utils.ts`
Safe IP extraction (currently duplicated in 5 routes via `(request as any).ip`):
- `getClientIP(request: Request): string`
- Proper x-forwarded-for parsing, fallback handling

### 1.5 `src/lib/mermaid-utils.ts`
Centralize mermaid regex (currently different in ChatPanel and ChatMessage):
- `MERMAID_BLOCK_REGEX`
- `hasMermaidBlock(text: string): boolean`
- `extractMermaidBlocks(text: string): string[]`
- `stripMermaidBlocks(text: string): string`
- `splitContentByMermaid(text: string): Array<{ type: 'text' | 'mermaid'; content: string }>`

### 1.6 `src/types/chat.ts`
Shared types (currently defined inline in multiple files):
- `ChatMessage` interface (role, content, source)
- `ChatSummary` interface
- `SessionLog` interface
- `FeedbackType` type

## Phase 2: Component Refactor (Parallel Track A)

### 2.1 Extract `src/hooks/useChat.ts`
Pull chat logic out of ChatPanel.tsx:
- Message state management
- `sendMessage()` — streaming, abort, error handling
- Lead form trigger detection
- Mermaid diagram detection
- Integrates with `useChatHistory` for persistence

### 2.2 Extract `src/hooks/useChatHistory.ts`
Pull history persistence out of page.tsx:
- `loadHistory()`, `saveHistory()`, `clearHistory()`
- Session ID generation and management
- sessionStorage abstraction
- Single source of truth for messages

### 2.3 Extract `src/hooks/useAudioPlayer.ts`
Pull audio logic out of ChatPanel.tsx:
- TTS fetch and playback
- Audio ref management and cleanup
- Speaking state
- Proper URL.revokeObjectURL cleanup

### 2.4 Refactor `page.tsx`
- Replace 19 useState calls with hooks above
- Remove prop drilling by using hooks directly in children where possible
- Extract navigation handling to `handleNavigate` utility or hook
- Remove duplicate session ID generation

### 2.5 Refactor `ChatPanel.tsx`
- Use `useChat`, `useChatHistory`, `useAudioPlayer` hooks
- Component should only handle rendering and delegating to hooks
- Target: under 100 lines

### 2.6 Refactor `ChatMessage.tsx`
- Use `mermaid-utils.ts` instead of inline regex
- Extract `MessageActions` sub-component (copy, download, feedback)
- Extract content rendering to use `splitContentByMermaid()`

### 2.7 Refactor `IconSidebar.tsx`
- Extract `NavButton` component for repeated button styling
- Use constants for colors/sizes
- Extract `CaseStudiesSection` and `ChatListSection` sub-components

## Phase 3: API Route Cleanup (Parallel Track B)

### 3.1 Create `src/lib/api-middleware.ts`
DRY pattern for all routes:
- `withValidation(handler, options)` — wraps route handler with:
  - Origin validation (from security.ts)
  - Content-Type check
  - Rate limiting
  - IP extraction
  - Error handling wrapper
- Each route becomes: validate inputs, do work, return response

### 3.2 Refactor all 5 routes
Apply middleware pattern, use shared utilities:
- `chat/route.ts` — use sanitization.ts, validators.ts, constants.ts
- `tts/route.ts` — use constants.ts for text limits
- `lead/route.ts` — use sanitization.ts, validators.ts, shared email sending
- `feedback/route.ts` — persist to KV instead of console.log
- `verify-email/route.ts` — use validators.ts, extract disposable domain list to constants

### 3.3 Improve `security.ts`
- Fix origin validation bug (startsWith allows subdomain spoofing)
- Use URL constructor for proper parsing
- Move origins to constants

### 3.4 Improve `gemini.ts`
- Use constants for model name, tokens, temperature
- Fix CLAUDE.md vs code mismatch (gemini-2.5-flash vs gemini-2.0-flash)

## Phase 4: Tests (Parallel Track C)

### 4.1 Setup
- Install vitest + @testing-library/react + msw
- Configure vitest.config.ts

### 4.2 Unit tests for utilities
- `sanitization.test.ts` — HTML stripping, length limits, edge cases
- `validators.test.ts` — email validation, session ID validation
- `ip-utils.test.ts` — x-forwarded-for parsing, fallbacks
- `mermaid-utils.test.ts` — regex matching, extraction, splitting
- `rate-limit.test.ts` — window enforcement, cleanup
- `constants.test.ts` — sanity checks (values are positive, keys non-empty)

### 4.3 API route tests
- `chat/route.test.ts` — rate limiting, sanitization, streaming
- `tts/route.test.ts` — rate limiting, text truncation
- `lead/route.test.ts` — validation, email sending, Slack notification
- `feedback/route.test.ts` — persistence, rate limiting
- `verify-email/route.test.ts` — format, disposable, MX checks

### 4.4 Hook tests
- `useChat.test.ts` — message flow, streaming, error handling
- `useChatHistory.test.ts` — load/save/clear, session management
- `useAudioPlayer.test.ts` — playback, cleanup

### 4.5 Component tests
- `ChatMessage.test.tsx` — rendering, actions, mermaid content
- `ChatInput.test.tsx` — input handling, submission
- `EmailGate.test.tsx` — validation flow, gate behavior

## File Changes Summary

### New files:
- `src/lib/constants.ts`
- `src/lib/sanitization.ts`
- `src/lib/validators.ts`
- `src/lib/ip-utils.ts`
- `src/lib/mermaid-utils.ts`
- `src/lib/api-middleware.ts`
- `src/types/chat.ts`
- `src/hooks/useChat.ts`
- `src/hooks/useChatHistory.ts`
- `src/hooks/useAudioPlayer.ts`
- `vitest.config.ts`
- All test files (14 files)

### Modified files:
- `src/app/page.tsx` — use hooks, reduce state
- `src/components/ChatPanel.tsx` — use hooks, slim down
- `src/components/ChatMessage.tsx` — use mermaid-utils, extract actions
- `src/components/IconSidebar.tsx` — extract sub-components, use constants
- `src/app/api/chat/route.ts` — use middleware, shared utils
- `src/app/api/tts/route.ts` — use middleware, constants
- `src/app/api/lead/route.ts` — use middleware, shared utils
- `src/app/api/feedback/route.ts` — use middleware, add persistence
- `src/app/api/verify-email/route.ts` — use middleware, shared validators
- `src/lib/security.ts` — fix origin bug, use constants
- `src/lib/gemini.ts` — use constants
- `src/lib/chat-logger.ts` — use constants
- `package.json` — add test dependencies
