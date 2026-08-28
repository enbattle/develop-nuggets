import body from './n-plus-one-queries.md?raw';
import type { Nugget } from '@/types';

export const nPlusOneQueries: Nugget = {
  id: 'n-plus-one-queries',
  title: 'The N+1 Query Problem',
  summary:
    'The pattern that fires one query per row in a loop, why it hides in innocent-looking ORM code, and how eager loading fixes it.',
  tags: ['databases', 'performance'],
  section: 'databases-modeling',
  body,
  format: 'nugget',
};
