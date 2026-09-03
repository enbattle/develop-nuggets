import body from './evaluation.md?raw';
import type { Nugget } from '@/types';

export const evaluation: Nugget = {
  id: 'evaluation',
  title: 'Agent Evaluation',
  summary:
    'Scoring agents on multi-step behaviour: goal completion, tool correctness, step efficiency, reasoning quality, and multi-turn coherence.',
  tags: ['agents', 'evals', 'testing'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
