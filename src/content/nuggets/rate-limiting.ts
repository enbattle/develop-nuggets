import body from './rate-limiting.md?raw';
import type { Nugget } from '@/types';

export const rateLimiting: Nugget = {
  id: 'rate-limiting',
  title: 'Rate Limiting',
  summary:
    'Capping how often a client can call you — token bucket, sliding window — to protect capacity and enforce fair use.',
  tags: ['apis', 'reliability'],
  section: 'apis-communication',
  body,
  format: 'nugget',
};
