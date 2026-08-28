import body from './distributed-locks.md?raw';
import type { Nugget } from '@/types';

export const distributedLocks: Nugget = {
  id: 'distributed-locks',
  title: 'Distributed Locks',
  summary:
    'Coordinating exclusive access across machines when a single-process mutex no longer applies — and why every such lock needs a lease.',
  tags: ['reliability', 'patterns', 'databases'],
  section: 'reliability',
  body,
  format: 'nugget',
};
