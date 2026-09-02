import body from './reliability-scale.md?raw';
import type { Nugget } from '@/types';

export const reliabilityScale: Nugget = {
  id: 'reliability-scale',
  title: 'Reliability & Scale',
  summary:
    'Keeping an AI service up and fast under load — retries with backoff, circuit breakers, parallelism, load balancing, graceful degradation, and SLA targets.',
  tags: ['ai', 'mlops', 'reliability', 'performance'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
