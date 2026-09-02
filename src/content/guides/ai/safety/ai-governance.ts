import body from './ai-governance.md?raw';
import type { Nugget } from '@/types';

export const aiGovernance: Nugget = {
  id: 'ai-governance',
  title: 'AI Governance & Audit Trails',
  summary:
    'The documentation-and-process side of AI safety — audit logging, model cards, incident response, and the compliance regimes that require them.',
  tags: ['ai', 'guardrails', 'process', 'security'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
