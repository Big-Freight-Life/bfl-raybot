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
