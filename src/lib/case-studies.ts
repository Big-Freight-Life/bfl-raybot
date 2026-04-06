export interface CaseStudyHighlight {
  title: string;
  key: string;
  content?: string;
}

export type PresentationBlock =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'image'; src?: string; alt: string; caption?: string; color?: string }
  | { type: 'list'; items: string[] };

export interface CaseStudy {
  title: string;
  key: string;
  summary: string;
  highlights: CaseStudyHighlight[];
  architecture?: string;
  presentation?: PresentationBlock[];
  role?: string;
  date?: string;
}

export const aboutRay: CaseStudy = {
  title: 'More About Ray',
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
    role: 'Lead Design Technologist',
    date: '2024',
    summary: 'A federated integration layer that turned Hyland OnBase into the source of truth for millions of documents flowing across ERP, HR, and finance systems. Replaced fragile point-to-point integrations with a canonical schema, event-driven message broker, and AI-assisted metadata extraction. Built for compliance teams who needed every document touch traceable.',
    highlights: [
      {
        title: 'The Challenge',
        key: 'challenge',
        content:
          'A Fortune 500 customer needed OnBase to become the source of truth for millions of documents flowing between ERP, HR, and finance systems. Existing integrations were fragile, event-driven logic was duplicated across teams, and compliance required every document touch be auditable.',
      },
      {
        title: 'Architecture',
        key: 'architecture',
        content:
          'Federated integration layer between OnBase and downstream systems. Webhook events pass through a message broker, get normalized into a canonical schema, then distributed to consumers. Metadata extraction runs through a rules engine with AI fallback for unstructured docs.',
      },
      {
        title: 'AI Integration',
        key: 'ai-integration',
        content:
          'When rules-based metadata extraction fell short (contracts, scanned forms, handwritten notes), documents were routed to an AI fallback service using vision-capable LLMs for structured extraction. Low-confidence results queued for human review.',
      },
      {
        title: 'Results',
        key: 'results',
        content:
          'Document processing latency dropped from hours to minutes. Integration maintenance cost fell by ~60% after consolidating duplicated logic into a single canonical layer. Audit queries that used to take days now resolve in seconds.',
      },
      {
        title: 'Lessons Learned',
        key: 'lessons',
        content:
          'A canonical schema up front is non-negotiable when integrating multiple enterprise systems. AI should be a fallback for unstructured content, not the primary path — rules engines are still faster and more reliable for the 80% case.',
      },
    ],
    architecture:
      'A federated integration layer sits between Hyland OnBase and downstream enterprise systems (ERP, HR, finance). Document events in OnBase trigger webhook notifications that are routed through a message broker, normalized into a canonical schema, and distributed to consuming systems.\n\nMetadata extraction runs through a rules engine with optional AI fallback for unstructured documents. Audit logs are centralized in a dedicated observability pipeline so compliance teams can trace every document touch across systems.\n\nKey components: OnBase event webhooks, Kafka-based message broker, canonical document schema, rules-based metadata engine, AI fallback service, audit log aggregator.',
    presentation: [
      { type: 'paragraph', text: 'Enterprise content management integration for document-heavy workflows across ERP, HR, and finance systems.' },
      { type: 'image', alt: 'System architecture overview', caption: 'Federated integration layer', color: '#0e5f67' },
      { type: 'heading', level: 2, text: 'The Challenge' },
      { type: 'paragraph', text: 'A Fortune 500 customer needed OnBase to become the source of truth for millions of documents flowing between ERP, HR, and finance systems. Existing integrations were fragile, event-driven logic was duplicated across teams, and compliance required every document touch be auditable.' },
      { type: 'heading', level: 2, text: 'What We Built' },
      { type: 'list', items: [
        'Canonical document schema shared across all consuming systems',
        'Event-driven message broker for decoupled integration',
        'Rules-based metadata engine with AI fallback for unstructured content',
        'Centralized audit log pipeline for compliance traceability',
      ]},
      { type: 'image', alt: 'Metadata extraction pipeline', caption: 'Rules + AI fallback extraction', color: '#117680' },
      { type: 'heading', level: 2, text: 'Results' },
      { type: 'paragraph', text: 'Document processing latency dropped from hours to minutes. Integration maintenance cost fell by approximately 60% after consolidating duplicated logic into a single canonical layer. Audit queries that used to take days now resolve in seconds.' },
    ],
  },
  {
    title: 'Hyland for Workday',
    key: 'hyland-workday',
    role: 'Design Technologist',
    date: '2023',
    summary: 'A bidirectional sync layer that brought Hyland documents into Workday workflows for HR, finance, and approval routing. Surfaced supporting documents directly inside the Workday UI through a custom tab, eliminating context switching. Document generation flows the other direction so templated agreements and approvals stay in sync across both systems.',
    highlights: [
      {
        title: 'The Challenge',
        key: 'challenge',
        content:
          'HR and finance teams were manually attaching supporting documents to Workday records — offer letters, invoices, signed agreements — creating a disjointed experience and compliance gaps. Workday had no native content repository and Hyland had no native Workday UI.',
      },
      {
        title: 'Architecture',
        key: 'architecture',
        content:
          'Bidirectional sync between Workday business objects and Hyland document repositories. Workday transactions resolve related documents from Hyland and surface them via a custom tab. Document generation flows the other direction for approval routing.',
      },
      {
        title: 'AI Integration',
        key: 'ai-integration',
        content:
          'Document classification on ingestion routes invoices, agreements, and forms to the right Hyland repository automatically. Extracted fields pre-populate Workday records, reducing manual data entry and keying errors.',
      },
      {
        title: 'Results',
        key: 'results',
        content:
          'HR case resolution time cut nearly in half. Workday users no longer leave the platform to find supporting documents. Finance approval cycles moved from days to hours for documents with generated templates.',
      },
      {
        title: 'Lessons Learned',
        key: 'lessons',
        content:
          'Bidirectional sync is harder than it looks — conflict resolution between two systems of record requires explicit rules, not defaults. Surfacing content where users already work is more valuable than building a new UI they have to learn.',
      },
    ],
    architecture:
      'A bidirectional sync layer connects Workday business objects (workers, positions, requisitions) to Hyland document repositories. When a Workday transaction occurs, the sync layer resolves the related document set from Hyland and attaches it to the Workday record via a custom tab integration.\n\nDocument generation flows the other direction: Workday triggers produce templated documents in Hyland, which are then indexed and made available back to Workday workflows for approval routing.\n\nKey components: Workday web services client, Hyland content services API, bidirectional sync engine, document template service, custom tab UI integration, approval routing adapter.',
    presentation: [
      { type: 'paragraph', text: 'Connecting Hyland content services with Workday HR and finance workflows through a bidirectional sync layer.' },
      { type: 'image', alt: 'Workday + Hyland integration', caption: 'Bidirectional sync architecture', color: '#0e5f67' },
      { type: 'heading', level: 2, text: 'The Challenge' },
      { type: 'paragraph', text: 'HR and finance teams were manually attaching supporting documents to Workday records — offer letters, invoices, signed agreements — creating a disjointed experience and compliance gaps. Workday had no native content repository and Hyland had no native Workday UI.' },
      { type: 'heading', level: 2, text: 'What We Built' },
      { type: 'list', items: [
        'Custom tab inside Workday surfacing related Hyland documents',
        'Bidirectional sync engine with explicit conflict resolution',
        'Document template service for generated approval documents',
        'AI classification on document ingestion for auto-routing',
      ]},
      { type: 'image', alt: 'Custom tab UI', caption: 'Documents surfaced where users already work', color: '#117680' },
      { type: 'heading', level: 2, text: 'Results' },
      { type: 'paragraph', text: 'HR case resolution time cut nearly in half. Workday users no longer leave the platform to find supporting documents. Finance approval cycles moved from days to hours for documents with generated templates.' },
    ],
  },
  {
    title: 'Salesforce Migration',
    key: 'salesforce-migration',
    role: 'Solutions Architect',
    date: '2022',
    summary: 'A staged migration pipeline that moved a decade of CRM customizations into Salesforce with zero downtime. Used change-data-capture for extraction, a transformation rule engine for field mapping and dedup, and aggressive post-load validation to guarantee data integrity. Workflows were re-implemented natively in Salesforce Flow rather than lifted-and-shifted.',
    highlights: [
      {
        title: 'The Challenge',
        key: 'challenge',
        content:
          'A legacy CRM had years of customization, undocumented workflows, and inconsistent data. Leadership wanted to move to Salesforce without losing business logic or breaking downstream reports. The risk was high — any missed workflow meant a broken revenue process.',
      },
      {
        title: 'Architecture',
        key: 'architecture',
        content:
          'Three-phase migration pipeline: extract (CDC to read-only replica), transform (staging environment with mapping rules and dedup), and load-validate (parallel batches with rollback and post-load integrity checks). Workflows re-implemented natively in Salesforce Flow.',
      },
      {
        title: 'AI Integration',
        key: 'ai-integration',
        content:
          'AI-assisted data profiling identified undocumented patterns in the legacy system — field usage, implicit workflows, duplicate detection heuristics. Saved weeks of manual discovery and flagged edge cases humans would have missed.',
      },
      {
        title: 'Results',
        key: 'results',
        content:
          'Zero-downtime cutover. 99.9% data integrity across validated fields. Legacy maintenance burden eliminated. Sales and marketing teams had a modern platform for the first time with workflows that actually reflected current business practice.',
      },
      {
        title: 'Lessons Learned',
        key: 'lessons',
        content:
          'Treat the migration as a chance to clean house, not just a lift-and-shift. The original system encoded a decade of assumptions, many of which were no longer valid. Aggressive validation at every phase is what makes zero-downtime migrations possible.',
      },
    ],
    architecture:
      'A staged migration pipeline moved data from a legacy CRM into Salesforce in three phases: extract, transform, and load-validate. Extraction used change-data-capture to snapshot the source in a read-only replica. Transformation applied field-level mapping rules and deduplication logic in a dedicated staging environment.\n\nThe load phase ran in parallel batches with automatic rollback on record-level failures. Post-load validation cross-checked counts, foreign key integrity, and workflow state across both systems. Workflows and automations were re-implemented natively in Salesforce Flow to preserve business logic.\n\nKey components: CDC extractor, staging database, transformation rule engine, batch loader with rollback, validation harness, Salesforce Flow migration.',
    presentation: [
      { type: 'paragraph', text: 'Large-scale CRM migration with zero downtime, preserving data integrity and business workflows at every step.' },
      { type: 'image', alt: 'Migration pipeline diagram', caption: 'Three-phase migration pipeline', color: '#0e5f67' },
      { type: 'heading', level: 2, text: 'The Challenge' },
      { type: 'paragraph', text: 'A legacy CRM had years of customization, undocumented workflows, and inconsistent data. Leadership wanted to move to Salesforce without losing business logic or breaking downstream reports. The risk was high — any missed workflow meant a broken revenue process.' },
      { type: 'heading', level: 2, text: 'What We Built' },
      { type: 'list', items: [
        'Change-data-capture extraction to a read-only replica',
        'Staging environment with field mapping and dedup rules',
        'Parallel batch loader with automatic rollback',
        'Post-load validation harness for cross-system integrity',
        'Workflows re-implemented natively in Salesforce Flow',
      ]},
      { type: 'image', alt: 'AI-assisted data profiling', caption: 'AI profiling identified undocumented patterns', color: '#117680' },
      { type: 'heading', level: 2, text: 'Results' },
      { type: 'paragraph', text: 'Zero-downtime cutover. 99.9% data integrity across validated fields. Legacy maintenance burden eliminated. Sales and marketing teams had a modern platform for the first time, with workflows that actually reflected current business practice.' },
    ],
  },
];
