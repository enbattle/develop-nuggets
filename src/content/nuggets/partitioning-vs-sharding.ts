import body from './partitioning-vs-sharding.md?raw';
import type { Nugget } from '@/types';

export const partitioningVsSharding: Nugget = {
  id: 'partitioning-vs-sharding',
  title: 'Partitioning vs. Sharding',
  summary:
    'Two words often used interchangeably: splitting a table for manageability vs. spreading it across machines for scale.',
  tags: ['databases', 'patterns', 'performance'],
  section: 'scaling-performance',
  body,
  format: 'nugget',
};
