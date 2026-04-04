export interface CaseStudyHighlight {
  title: string;
  key: string;
  content?: string;
}

export interface CaseStudy {
  title: string;
  key: string;
  summary: string;
  highlights: CaseStudyHighlight[];
}

export const aboutRay: CaseStudy = {
  title: 'About Ray',
  key: 'about-ray',
  summary: 'Design Technologist building systems that encode good decisions.',
  highlights: [
    {
      title: 'Experience',
      key: 'experience',
      content:
        'Ray Butler is a Design Technologist with deep expertise in enterprise SaaS, healthcare workflows, finance and AP automation, and government systems.\n\nHe operates at the intersection of experience design, product strategy, and AI systems — focusing on how systems actually behave, not just how they are described.\n\nHis work spans complex organizations where decisions, ownership, workflows, and data must align to produce reliable outcomes at scale.',
    },
    {
      title: 'Toolbox',
      key: 'toolbox',
      content:
        'Ray works across the full stack of modern product and AI development:\n\n• Frontend — React, Next.js, TypeScript, MUI\n• AI/ML — Gemini, Claude, OpenAI, LangChain, prompt engineering\n• Cloud — Vercel, AWS, Google Cloud\n• Data — PostgreSQL, Redis, Vercel KV\n• Design — Figma, system design, workflow modeling\n• Integration — Salesforce, Hyland, Workday, Mermaid.js\n\nThe toolbox is secondary to the thinking — tools change, but the ability to choose the right one for the job does not.',
    },
    {
      title: 'Methodologies',
      key: 'methodologies',
      content:
        'Ray approaches every engagement through a systems-thinking lens:\n\n• Diagnosis first — understand what is actually happening before proposing solutions\n• Design is behavior — interfaces and workflows define how systems think, not just how they look\n• AI as output — AI is the result of a well-structured system, not the starting point\n• Structural alignment — most failures come from misalignment between decisions, ownership, and data\n• Enterprise awareness — every solution must account for scale, governance, and operational impact',
    },
  ],
};

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
