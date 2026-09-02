import body from './production-deployment.md?raw';
import type { Nugget } from '@/types';

export const productionDeployment: Nugget = {
  id: 'production-deployment',
  title: 'Production Deployment',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ['ai', 'patterns', 'performance', 'process'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
