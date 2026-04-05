import { describe, it, expect } from 'vitest';
import {
  hasMermaidBlock,
  hasIncompleteMermaidBlock,
  extractFirstMermaid,
  stripMermaidBlocks,
  splitContentByMermaid,
} from '../mermaid-utils';

const COMPLETE_BLOCK = '```mermaid\ngraph TD\nA-->B\n```';
const INCOMPLETE_BLOCK = '```mermaid\ngraph TD\nA-->B';

describe('hasMermaidBlock', () => {
  it('detects a complete mermaid block', () => {
    expect(hasMermaidBlock(COMPLETE_BLOCK)).toBe(true);
  });

  it('returns false for incomplete block', () => {
    expect(hasMermaidBlock(INCOMPLETE_BLOCK)).toBe(false);
  });

  it('returns false when no mermaid block exists', () => {
    expect(hasMermaidBlock('just plain text')).toBe(false);
  });
});

describe('hasIncompleteMermaidBlock', () => {
  it('detects streaming/incomplete block', () => {
    expect(hasIncompleteMermaidBlock(INCOMPLETE_BLOCK)).toBe(true);
  });

  it('returns false for complete block', () => {
    expect(hasIncompleteMermaidBlock(COMPLETE_BLOCK)).toBe(false);
  });

  it('returns false when no mermaid at all', () => {
    expect(hasIncompleteMermaidBlock('no mermaid here')).toBe(false);
  });
});

describe('extractFirstMermaid', () => {
  it('extracts code from a mermaid block', () => {
    expect(extractFirstMermaid(COMPLETE_BLOCK)).toBe('graph TD\nA-->B');
  });

  it('returns null when no mermaid block', () => {
    expect(extractFirstMermaid('no code here')).toBeNull();
  });

  it('returns first block when multiple exist', () => {
    const multi = '```mermaid\nfirst\n```\ntext\n```mermaid\nsecond\n```';
    expect(extractFirstMermaid(multi)).toBe('first');
  });
});

describe('stripMermaidBlocks', () => {
  it('removes all mermaid blocks', () => {
    const text = 'before\n```mermaid\ngraph TD\n```\nafter';
    expect(stripMermaidBlocks(text)).toBe('before\n\nafter');
  });

  it('preserves surrounding text', () => {
    const text = 'hello ```mermaid\ncode\n``` world';
    const result = stripMermaidBlocks(text);
    expect(result).toContain('hello');
    expect(result).toContain('world');
    expect(result).not.toContain('```mermaid');
  });
});

describe('splitContentByMermaid', () => {
  it('splits mixed content correctly', () => {
    const text = 'before\n```mermaid\ngraph TD\n```\nafter';
    const segments = splitContentByMermaid(text);
    expect(segments).toHaveLength(3);
    expect(segments[0]).toEqual({ type: 'text', content: 'before\n' });
    expect(segments[1]).toEqual({ type: 'mermaid', content: 'graph TD' });
    expect(segments[2]).toEqual({ type: 'text', content: '\nafter' });
  });

  it('handles text-only content', () => {
    const segments = splitContentByMermaid('just text');
    expect(segments).toHaveLength(1);
    expect(segments[0]).toEqual({ type: 'text', content: 'just text' });
  });

  it('handles mermaid-only content', () => {
    const segments = splitContentByMermaid(COMPLETE_BLOCK);
    expect(segments).toHaveLength(1);
    expect(segments[0].type).toBe('mermaid');
  });

  it('hides incomplete blocks', () => {
    const text = 'visible text\n```mermaid\nstill streaming...';
    const segments = splitContentByMermaid(text);
    // incomplete mermaid should be stripped
    expect(segments.every((s) => s.type === 'text')).toBe(true);
    expect(segments.some((s) => s.content.includes('visible text'))).toBe(true);
  });
});
