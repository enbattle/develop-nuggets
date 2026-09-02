import body from './common-pitfalls.md?raw';
import type { Nugget } from '@/types';

export const commonPitfalls: Nugget = {
  id: 'common-pitfalls',
  title: 'Common Pitfalls',
  summary:
    'The eval mistakes that surface too late — tiny samples, happy-path-only sets, overfitting the eval, single-metric tunnel vision.',
  tags: ['ai', 'evals', 'testing', 'process'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
