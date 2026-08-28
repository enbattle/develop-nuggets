import body from './sharding-strategies.md?raw';
import type { Nugget } from '@/types';

export const shardingStrategies: Nugget = {
  id: 'sharding-strategies',
  title: 'Sharding Strategies',
  summary:
    'Range, hash, and directory-based sharding compared — how each spreads load and what each makes hard (re-sharding, cross-shard queries).',
  tags: ['databases', 'performance', 'patterns'],
  section: 'scaling-performance',
  body,
  format: 'nugget',
};
