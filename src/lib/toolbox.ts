export interface ToolboxItem {
  title: string;
  key: string;
  prompt: string;
}

export const softwareTools: ToolboxItem[] = [
  { title: 'React & Next.js', key: 'react-nextjs', prompt: 'Tell me about how Ray uses React and Next.js in his work.' },
  { title: 'TypeScript', key: 'typescript', prompt: 'How does Ray use TypeScript in his projects?' },
  { title: 'Figma', key: 'figma', prompt: 'Tell me about how Ray uses Figma for design and prototyping.' },
  { title: 'Vercel', key: 'vercel', prompt: 'How does Ray use Vercel for deployment and infrastructure?' },
  { title: 'MUI & Design Systems', key: 'mui-design-systems', prompt: 'Tell me about how Ray builds design systems with MUI.' },
  { title: 'PostgreSQL & Redis', key: 'postgres-redis', prompt: 'How does Ray work with PostgreSQL and Redis for data?' },
  { title: 'Mermaid.js', key: 'mermaidjs', prompt: 'How does Ray use Mermaid.js for diagrams and workflow modeling?' },
  { title: 'Salesforce & Integrations', key: 'salesforce-integrations', prompt: 'Tell me about Ray\'s experience with Salesforce and enterprise integrations.' },
];

export const agentSkills: ToolboxItem[] = [
  { title: 'UX Audit', key: 'ux-audit', prompt: 'Tell me about the UX Audit agent skill — how does it evaluate interfaces and identify usability issues?' },
  { title: 'Product Strategy', key: 'product-strategy', prompt: 'Tell me about the Product Strategy agent skill — how does it help define roadmaps and prioritize features?' },
  { title: 'System Architecture', key: 'system-architecture', prompt: 'Tell me about the System Architecture agent skill — how does it design scalable technical systems?' },
  { title: 'User Research', key: 'user-research', prompt: 'Tell me about the User Research agent skill — how does it synthesize interviews, surveys, and behavioral data?' },
  { title: 'Competitive Analysis', key: 'competitive-analysis', prompt: 'Tell me about the Competitive Analysis agent skill — how does it evaluate market positioning and feature gaps?' },
  { title: 'Workflow Design', key: 'workflow-design', prompt: 'Tell me about the Workflow Design agent skill — how does it map and optimize business processes?' },
  { title: 'AI Agent Builder', key: 'ai-agent-builder', prompt: 'Tell me about the AI Agent Builder skill — how does it design multi-step agent architectures and tool chains?' },
  { title: 'Design System', key: 'design-system', prompt: 'Tell me about the Design System agent skill — how does it create and maintain consistent component libraries?' },
  { title: 'Prompt Engineering', key: 'prompt-engineering', prompt: 'Tell me about the Prompt Engineering agent skill — how does it craft system prompts and optimize model output?' },
  { title: 'Data Modeling', key: 'data-modeling', prompt: 'Tell me about the Data Modeling agent skill — how does it structure schemas and data flows for products?' },
  { title: 'Stakeholder Brief', key: 'stakeholder-brief', prompt: 'Tell me about the Stakeholder Brief agent skill — how does it translate technical work into executive-ready summaries?' },
  { title: 'Content Strategy', key: 'content-strategy', prompt: 'Tell me about the Content Strategy agent skill — how does it plan messaging, copy, and information architecture?' },
];
