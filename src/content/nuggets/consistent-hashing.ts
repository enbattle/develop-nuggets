import body from './consistent-hashing.md?raw';
import type { Nugget } from '@/types';

export const consistentHashing: Nugget = {
  id: 'consistent-hashing',
  title: 'Consistent Hashing',
  summary:
    'Spreading keys across servers so that adding or removing a node reshuffles a small slice of the data, not all of it.',
  tags: ['databases', 'performance'],
  section: 'scaling-performance',
  body,
  format: 'nugget',
};
