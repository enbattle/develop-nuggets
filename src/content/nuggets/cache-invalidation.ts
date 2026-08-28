import body from './cache-invalidation.md?raw';
import type { Nugget } from '@/types';

export const cacheInvalidation: Nugget = {
  id: 'cache-invalidation',
  title: 'Cache Invalidation',
  summary:
    'The strategies for keeping cached data from going stale — TTLs, write-through, explicit busting — and where each one bites you.',
  tags: ['performance', 'patterns'],
  section: 'scaling-performance',
  body,
  format: 'nugget',
};
