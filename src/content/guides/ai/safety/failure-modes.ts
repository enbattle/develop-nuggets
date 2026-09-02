import body from './failure-modes.md?raw';
import type { Nugget } from '@/types';

export const failureModes: Nugget = {
  id: 'failure-modes',
  title: 'AI Failure Modes: A Taxonomy',
  summary:
    'A taxonomy of how AI systems go wrong — hallucination, harmful output, prompt injection, over-refusal — with a severity/probability matrix for prioritising defences.',
  tags: ['ai', 'guardrails', 'security', 'process'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
