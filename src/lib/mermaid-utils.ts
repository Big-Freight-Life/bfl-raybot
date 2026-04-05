/** Regex to match a complete ```mermaid ... ``` code block */
const MERMAID_BLOCK_RE = /```mermaid\n([\s\S]*?)```/g;

/** Regex to detect an opening ```mermaid tag (for incomplete streaming blocks) */
const MERMAID_OPEN_RE = /```mermaid\n/;

/** Check if text contains a complete mermaid block */
export function hasMermaidBlock(text: string): boolean {
  MERMAID_BLOCK_RE.lastIndex = 0;
  return MERMAID_BLOCK_RE.test(text);
}

/** Check if text has an incomplete (still-streaming) mermaid block */
export function hasIncompleteMermaidBlock(text: string): boolean {
  return MERMAID_OPEN_RE.test(text) && !hasMermaidBlock(text);
}

/** Extract the first mermaid code block content (without fences) */
export function extractFirstMermaid(text: string): string | null {
  MERMAID_BLOCK_RE.lastIndex = 0;
  const match = MERMAID_BLOCK_RE.exec(text);
  return match ? match[1].trim() : null;
}

/** Strip all mermaid code blocks from text */
export function stripMermaidBlocks(text: string): string {
  return text.replace(MERMAID_BLOCK_RE, '').trim();
}

/** Content segment — either plain text or mermaid code */
export type ContentSegment =
  | { type: 'text'; content: string }
  | { type: 'mermaid'; content: string };

/**
 * Split text into alternating text and mermaid segments.
 * Hides incomplete mermaid blocks (still streaming).
 */
export function splitContentByMermaid(text: string): ContentSegment[] {
  // Hide incomplete mermaid blocks
  const displayText = hasIncompleteMermaidBlock(text)
    ? text.replace(/```mermaid\n[\s\S]*$/, '').trimEnd()
    : text;

  const parts = displayText.split(/(```mermaid\n[\s\S]*?```)/g);
  const segments: ContentSegment[] = [];

  for (const part of parts) {
    MERMAID_BLOCK_RE.lastIndex = 0;
    const mermaidMatch = MERMAID_BLOCK_RE.exec(part);
    if (mermaidMatch) {
      segments.push({ type: 'mermaid', content: mermaidMatch[1].trim() });
    } else if (part.trim()) {
      segments.push({ type: 'text', content: part });
    }
  }

  return segments;
}
