// AW Score (Augmented Worker Score)
// A self-assessment of how integrated AI is across someone's day-to-day work.

export interface AWDimension {
  key: string;
  label: string;
  question: string;
  helper: string;
  // Five labels for levels 1..5
  levelLabels: [string, string, string, string, string];
}

export const AW_DIMENSIONS: AWDimension[] = [
  {
    key: 'tools',
    label: 'Tools',
    question: 'Which AI tools are part of your day?',
    helper: 'How many AI tools you actually use, not how many you’ve heard of.',
    levelLabels: [
      'None',
      'Tried ChatGPT once or twice',
      'A few tools, occasional use',
      'Multiple tools, daily',
      'A connected stack across roles',
    ],
  },
  {
    key: 'workflow',
    label: 'Workflow',
    question: 'How embedded is AI in how you work?',
    helper: 'Sidekick vs. structural part of how the work gets done.',
    levelLabels: [
      'Not embedded',
      'Bolt-on for one-off tasks',
      'Routine for some tasks',
      'Default for most tasks',
      'AI is a structural part of the workflow',
    ],
  },
  {
    key: 'output',
    label: 'Output',
    question: 'Has AI changed what you can ship?',
    helper: 'Quality, scope, or volume that wouldn’t exist without AI.',
    levelLabels: [
      'No noticeable change',
      'A bit faster on small things',
      'Meaningfully faster',
      'Shipping things you couldn’t before',
      'Output looks like a small team’s',
    ],
  },
  {
    key: 'architecture',
    label: 'Architecture',
    question: 'Are you building AI-native systems?',
    helper: 'Are you bolting AI on, or designing systems around it?',
    levelLabels: [
      'Not relevant to my work',
      'Aware of patterns',
      'Built one or two AI features',
      'AI features ship regularly',
      'Systems are designed AI-native end to end',
    ],
  },
  {
    key: 'decisions',
    label: 'Decisions',
    question: 'Does AI inform how you make decisions?',
    helper: 'Strategic and structural decisions, not just task-level help.',
    levelLabels: [
      'Never',
      'Occasionally for small choices',
      'Regularly for analysis and drafts',
      'Used in most non-trivial decisions',
      'AI shapes how I frame the decision',
    ],
  },
  {
    key: 'team',
    label: 'Team',
    question: 'Is your team augmented, or just you?',
    helper: 'Solo augmentation has a ceiling. Team augmentation compounds.',
    levelLabels: [
      'No team / not applicable',
      'I’m the only one using it',
      'A few people use it',
      'Most of the team uses it',
      'The team is structurally augmented together',
    ],
  },
];

// Ray's benchmark profile (deliberately not all 5s — a real profile)
export const RAY_PROFILE: Record<string, number> = {
  tools: 5,
  workflow: 5,
  output: 5,
  architecture: 5,
  decisions: 4,
  team: 4,
};

export const RAY_AVERAGE = average(Object.values(RAY_PROFILE));

export interface AWLevel {
  level: 0 | 1 | 2 | 3 | 4 | 5;
  label: string;
  short: string;
  description: string;
  next: string;
}

export const AW_LEVELS: AWLevel[] = [
  {
    level: 0,
    label: 'Unaware',
    short: 'AI is not part of how you work.',
    description:
      'AI hasn’t entered your day yet. Not a problem — but the gap between unaware and curious is the only one that requires effort to cross alone.',
    next: 'Start with one tool, one workflow, one week. The goal is exposure, not adoption.',
  },
  {
    level: 1,
    label: 'Curious',
    short: 'You’ve poked at AI but it hasn’t stuck.',
    description:
      'You’ve tried it. It hasn’t become a habit. Most people stall here because the friction of switching tools outweighs the perceived gain on any individual task.',
    next: 'Pick one recurring task you dislike and route it through AI for 30 days.',
  },
  {
    level: 2,
    label: 'Experimenting',
    short: 'You use AI regularly, but ad hoc.',
    description:
      'Real usage, no integration. AI sits next to your workflow, not inside it. The next step is structural — moving from "using AI" to "working with AI."',
    next: 'Identify the three tasks where you reach for AI today and codify that as a workflow.',
  },
  {
    level: 3,
    label: 'Adopting',
    short: 'AI is part of how some of your work gets done.',
    description:
      'AI is now load-bearing for parts of your work. The question stops being "should I use this?" and becomes "what should I never do again without it?"',
    next: 'Audit a week of work. For every task, ask: AI-first, AI-assisted, or AI-irrelevant?',
  },
  {
    level: 4,
    label: 'Integrated',
    short: 'AI shapes how your work is structured.',
    description:
      'You design tasks around AI capabilities, not the other way around. You ship things you couldn’t before, and you’re starting to think about how to make the team operate this way too.',
    next: 'Move from individual augmentation to team augmentation. The compounding starts there.',
  },
  {
    level: 5,
    label: 'Augmented',
    short: 'You operate as an augmented worker.',
    description:
      'AI is a force multiplier on your output and your decisions. Your individual ceiling looks like a small team’s. You think in terms of systems, not tools — and you can model how AI behaves in real conditions, not just demo conditions.',
    next: 'Help others reach this level. The gap between integrated and augmented is the gap most teams will not cross alone.',
  },
];

export function average(scores: number[]): number {
  if (!scores.length) return 0;
  const sum = scores.reduce((a, b) => a + b, 0);
  return sum / scores.length;
}

export function scoreToLevel(score: number): AWLevel {
  // 0..5 average → level 0..5 by rounding to nearest
  const rounded = Math.max(0, Math.min(5, Math.round(score))) as 0 | 1 | 2 | 3 | 4 | 5;
  return AW_LEVELS[rounded];
}

export interface AWResult {
  scores: Record<string, number>;
  average: number;
  level: AWLevel;
  weakest: { key: string; label: string };
}

export function computeResult(scores: Record<string, number>): AWResult {
  const values = AW_DIMENSIONS.map((d) => scores[d.key] ?? 0);
  const avg = average(values);
  const level = scoreToLevel(avg);
  // Find lowest dimension
  let weakestKey = AW_DIMENSIONS[0].key;
  let weakestVal = scores[weakestKey] ?? 0;
  for (const d of AW_DIMENSIONS) {
    const v = scores[d.key] ?? 0;
    if (v < weakestVal) {
      weakestKey = d.key;
      weakestVal = v;
    }
  }
  const weakestLabel = AW_DIMENSIONS.find((d) => d.key === weakestKey)!.label;
  return { scores, average: avg, level, weakest: { key: weakestKey, label: weakestLabel } };
}

export const AW_STORAGE_KEY = 'raybot_aw_score';

export function encodeScores(scores: Record<string, number>): string {
  // 6 single-digit values in dimension order
  return AW_DIMENSIONS.map((d) => String(scores[d.key] ?? 0)).join('');
}

export function decodeScores(encoded: string): Record<string, number> | null {
  if (!/^[0-5]{6}$/.test(encoded)) return null;
  const out: Record<string, number> = {};
  AW_DIMENSIONS.forEach((d, i) => {
    out[d.key] = Number(encoded[i]);
  });
  return out;
}
