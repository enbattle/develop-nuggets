import body from './red-teaming.md?raw';
import type { Nugget } from '@/types';

export const redTeaming: Nugget = {
  id: 'red-teaming',
  title: 'Red Teaming AI Systems',
  summary:
    'Systematic adversarial testing of an AI system — attack categories, manual versus automated tooling, and an LLM-vs-LLM red-team loop.',
  tags: ['ai', 'guardrails', 'security', 'testing'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
