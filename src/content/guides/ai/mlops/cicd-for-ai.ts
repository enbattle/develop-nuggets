import body from './cicd-for-ai.md?raw';
import type { Nugget } from '@/types';

export const cicdForAi: Nugget = {
  id: 'cicd-for-ai',
  title: 'CI/CD for AI',
  summary:
    'A CI/CD pipeline that gates on model behaviour and cost as well as tests — data validation, offline eval, quality gates, automated rollback.',
  tags: ['ai', 'mlops', 'process', 'reliability'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
