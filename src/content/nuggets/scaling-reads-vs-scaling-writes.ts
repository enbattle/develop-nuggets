import body from './scaling-reads-vs-scaling-writes.md?raw';
import type { Nugget } from '@/types';

export const scalingReadsVsScalingWrites: Nugget = {
  id: 'scaling-reads-vs-scaling-writes',
  title: 'Scaling Reads vs. Scaling Writes',
  summary:
    'Replicas and caches scale reads cheaply; writes are the hard part — why that asymmetry exists and what actually helps.',
  tags: ['performance', 'patterns', 'databases'],
  section: 'scaling-performance',
  body,
  format: 'nugget',
};
