import body from './redis.md?raw';
import type { Nugget } from '@/types';

export const redis: Nugget = {
  id: 'redis',
  title: 'Redis',
  summary:
    'The in-memory data-structure store used as cache, queue, rate limiter, and lock — its core types and its persistence model.',
  tags: ['databases', 'performance', 'tooling'],
  section: 'data-stores',
  body,
  format: 'guide',
};
