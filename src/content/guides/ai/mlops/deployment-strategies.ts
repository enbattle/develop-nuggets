import body from './deployment-strategies.md?raw';
import type { Nugget } from '@/types';

export const deploymentStrategies: Nugget = {
  id: 'deployment-strategies',
  title: 'Deployment Strategies',
  summary:
    'Rolling out a model change safely — blue-green, canary, A/B, and shadow mode, and a framework for choosing between them.',
  tags: ['ai', 'mlops', 'reliability', 'process'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
