import body from './evaluation-types.md?raw';
import type { Nugget } from '@/types';

export const evaluationTypes: Nugget = {
  id: 'evaluation-types',
  title: 'Evaluation Types',
  summary:
    'The four eval approaches — offline datasets, LLM-as-judge, online A/B, human rating — and which development phase each one fits.',
  tags: ['ai', 'evals', 'testing', 'process'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
