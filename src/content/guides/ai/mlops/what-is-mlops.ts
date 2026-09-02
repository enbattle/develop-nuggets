import body from './what-is-mlops.md?raw';
import type { Nugget } from '@/types';

export const whatIsMlops: Nugget = {
  id: 'what-is-mlops',
  title: 'What is MLOps?',
  summary:
    'What operating an AI system in production adds on top of normal software ops — versioning models and data, eval gates, drift monitoring, retraining.',
  tags: ['ai', 'mlops', 'process', 'reliability'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
