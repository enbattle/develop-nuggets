import body from './production-deployment.md?raw';
import type { Nugget } from '@/types';

export const productionDeployment: Nugget = {
  id: 'production-deployment',
  title: 'Production Deployment',
  summary:
    'Taking an agent from notebook to real traffic — sync versus async topologies, horizontal scaling on external state, graceful degradation, and a pre-launch checklist.',
  tags: ['agents', 'ai', 'reliability', 'process'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
