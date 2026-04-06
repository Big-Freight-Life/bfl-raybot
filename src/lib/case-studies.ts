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

export const processInfo: CaseStudy = {
  title: 'The Process',
  key: 'process',
  summary: 'How Big Freight Life works with clients — diagnosis to delivery.',
  presentation: [
    { type: 'image', alt: 'The Big Freight Life process', caption: 'Diagnose · Design · Build · Hand Off', color: '#0e5f67' },
    { type: 'heading', level: 2, text: 'Diagnose' },
    { type: 'paragraph', text: 'Every engagement starts with diagnosis. Before recommending tools, frameworks, or features, we map what is actually happening — where decisions are made, how data flows, where ownership is unclear, and which workflows depend on tribal knowledge.' },
    { type: 'paragraph', text: 'The goal is to surface structural issues before solutions get prescribed. Most failed implementations are not technology problems — they are misalignment problems.' },
    { type: 'heading', level: 2, text: 'Design' },
    { type: 'paragraph', text: 'Design is behavior, not decoration. We model how the system should think before drawing how it should look.' },
    { type: 'list', items: [
      'Workflow modeling — the real path users take, not the happy path',
      'Decision boundaries — what the system decides vs. what humans decide',
      'Data contracts — canonical schemas that survive change',
      'Integration points — how this system meets the ones around it',
    ]},
    { type: 'paragraph', text: 'Deliverables: workflow diagrams, system maps, interaction prototypes, and a shared model that engineering, product, and operations can all reason about.' },
    { type: 'heading', level: 2, text: 'Build' },
    { type: 'paragraph', text: 'Build phases ship in tight, demonstrable increments. We work alongside in-house teams rather than over the wall.' },
    { type: 'list', items: [
      'Reference implementations that prove the model works',
      'AI-assisted development to compress cycle time',
      'Continuous review against the original diagnosis',
      'Documentation that lives with the code',
    ]},
    { type: 'paragraph', text: 'The output is not just working software — it is a system the client team can own, extend, and explain.' },
    { type: 'heading', level: 2, text: 'Hand Off' },
    { type: 'paragraph', text: 'A successful engagement ends with the client team in control. Hand off includes architecture decision records, runbooks for the operational edges, training on the structural model, and a clear escalation path for the unknowns that always show up later.' },
    { type: 'paragraph', text: 'Big Freight Life stays available, but the goal is autonomy — not dependency.' },
  ],
  highlights: [
    {
      title: 'Diagnose',
      key: 'diagnose',
      content:
        'Every engagement starts with diagnosis. Before recommending tools, frameworks, or features, we map what is actually happening:\n\n• Where decisions are made and who makes them\n• How data flows between systems and teams\n• Where ownership is unclear or duplicated\n• Which workflows depend on tribal knowledge\n\nThe goal is to surface structural issues before solutions get prescribed. Most failed implementations are not technology problems — they are misalignment problems.',
    },
    {
      title: 'Design',
      key: 'design',
      content:
        'Design is behavior, not decoration. We model how the system should think before drawing how it should look:\n\n• Workflow modeling — the real path users take, not the happy path\n• Decision boundaries — what the system decides vs. what humans decide\n• Data contracts — canonical schemas that survive change\n• Integration points — how this system meets the ones around it\n\nDeliverables: workflow diagrams, system maps, interaction prototypes, and a shared model that engineering, product, and operations can all reason about.',
    },
    {
      title: 'Build',
      key: 'build',
      content:
        'Build phases ship in tight, demonstrable increments. We work alongside in-house teams rather than over the wall:\n\n• Reference implementations that prove the model works\n• AI-assisted development to compress cycle time\n• Continuous review against the original diagnosis\n• Documentation that lives with the code\n\nThe output is not just working software — it is a system the client team can own, extend, and explain.',
    },
    {
      title: 'Hand Off',
      key: 'hand-off',
      content:
        'A successful engagement ends with the client team in control. Hand off includes:\n\n• Architecture decision records and the reasoning behind them\n• Runbooks for the operational edges\n• Training on the structural model, not just the codebase\n• A clear escalation path for the unknowns that always show up later\n\nBig Freight Life stays available, but the goal is autonomy — not dependency.',
    },
  ],
};

export const contactInfo: CaseStudy = {
  title: 'Contact Us',
  key: 'contact',
  summary: 'Get in touch with Big Freight Life.',
  presentation: [
    { type: 'heading', level: 2, text: 'Address' },
    { type: 'paragraph', text: 'Big Freight Life LLC\n1351 N Buckner Blvd #180397\nDallas, TX 75218' },
    { type: 'heading', level: 2, text: 'Email' },
    { type: 'paragraph', text: 'hello@bflux.co' },
    { type: 'heading', level: 2, text: 'Business Hours' },
    { type: 'paragraph', text: 'Monday – Friday, 9am – 6pm CT' },
  ],
  highlights: [
    {
      title: 'Address',
      key: 'address',
      content:
        'Big Freight Life LLC\n1351 N Buckner Blvd #180397\nDallas, TX 75218',
    },
    {
      title: 'Email',
      key: 'email',
      content: 'hello@bflux.co',
    },
    {
      title: 'Business Hours',
      key: 'hours',
      content: 'Monday – Friday, 9am – 6pm CT',
    },
  ],
};

export const aboutRay: CaseStudy = {
  title: 'More About Ray',
  key: 'about-ray',
  summary: 'Design Technologist building systems that encode good decisions.',
  presentation: [
    { type: 'image', alt: 'About Ray Butler', caption: 'Design Technologist', color: '#0e5f67' },
    { type: 'heading', level: 2, text: 'Experience' },
    { type: 'paragraph', text: 'Ray Butler is a Design Technologist with deep expertise in enterprise SaaS, healthcare workflows, finance and AP automation, and government systems.' },
    { type: 'paragraph', text: 'He operates at the intersection of experience design, product strategy, and AI systems — focusing on how systems actually behave, not just how they are described.' },
    { type: 'paragraph', text: 'His work spans complex organizations where decisions, ownership, workflows, and data must align to produce reliable outcomes at scale.' },
    { type: 'heading', level: 2, text: 'Toolbox' },
    { type: 'paragraph', text: 'Ray works across the full stack of modern product and AI development:' },
    { type: 'list', items: [
      'Frontend — React, Next.js, TypeScript, MUI',
      'AI/ML — Gemini, Claude, OpenAI, LangChain, prompt engineering',
      'Cloud — Vercel, AWS, Google Cloud',
      'Data — PostgreSQL, Redis, Vercel KV',
      'Design — Figma, system design, workflow modeling',
      'Integration — Salesforce, Hyland, Workday, Mermaid.js',
    ]},
    { type: 'paragraph', text: 'The toolbox is secondary to the thinking — tools change, but the ability to choose the right one for the job does not.' },
    { type: 'heading', level: 2, text: 'Methodologies' },
    { type: 'paragraph', text: 'Ray approaches every engagement through a systems-thinking lens:' },
    { type: 'list', items: [
      'Diagnosis first — understand what is actually happening before proposing solutions',
      'Design is behavior — interfaces and workflows define how systems think, not just how they look',
      'AI as output — AI is the result of a well-structured system, not the starting point',
      'Structural alignment — most failures come from misalignment between decisions, ownership, and data',
      'Enterprise awareness — every solution must account for scale, governance, and operational impact',
    ]},
  ],
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
    summary: 'A federated integration layer that made Hyland OnBase the source of truth for millions of documents across ERP, HR, and finance systems — replacing fragile point-to-point integrations with a canonical schema and AI-assisted metadata extraction.',
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
    summary: 'A bidirectional sync layer bringing Hyland documents into Workday workflows for HR, finance, and approval routing — surfacing supporting documents directly inside the Workday UI to eliminate context switching.',
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
    summary: 'A staged migration pipeline that moved a decade of CRM customizations into Salesforce with zero downtime and 99.9% data integrity — workflows re-implemented natively in Salesforce Flow rather than lifted-and-shifted.',
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

export function findCaseStudyByKey(key: string): CaseStudy | undefined {
  if (key === 'about-ray') return aboutRay;
  if (key === 'process') return processInfo;
  if (key === 'contact') return contactInfo;
  return caseStudies.find((s) => s.key === key);
}
