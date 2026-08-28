import body from './optimistic-vs-pessimistic-locking.md?raw';
import type { Nugget } from '@/types';

export const optimisticVsPessimisticLocking: Nugget = {
  id: 'optimistic-vs-pessimistic-locking',
  title: 'Optimistic vs. Pessimistic Locking',
  summary:
    'Locking a row up front vs. checking for a conflict at write time — which fits high-contention vs. mostly-independent writes.',
  tags: ['databases', 'patterns', 'reliability'],
  section: 'databases-modeling',
  body,
  format: 'nugget',
};
