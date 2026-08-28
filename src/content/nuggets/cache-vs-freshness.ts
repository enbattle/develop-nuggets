import body from './cache-vs-freshness.md?raw';
import type { Nugget } from '@/types';

export const cacheVsFreshness: Nugget = {
  id: 'cache-vs-freshness',
  title: 'Cache vs. Freshness',
  summary:
    'Every cache trades correctness for speed; how to decide how much staleness a given feature can actually tolerate.',
  tags: ['performance', 'patterns'],
  section: 'scaling-performance',
  body,
  format: 'nugget',
};
