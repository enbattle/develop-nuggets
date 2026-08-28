import body from './exponential-backoff.md?raw';
import type { Nugget } from '@/types';

export const exponentialBackoff: Nugget = {
  id: 'exponential-backoff',
  title: 'Exponential Backoff & Jitter',
  summary:
    "Spacing retries with growing, randomized delays so a recovering service isn't knocked over again by a synchronized retry storm.",
  tags: ['reliability', 'apis'],
  section: 'reliability',
  body,
  format: 'nugget',
};
