import body from './sql-vs-nosql.md?raw';
import type { Nugget } from '@/types';

export const sqlVsNosql: Nugget = {
  id: 'sql-vs-nosql',
  title: 'SQL vs. NoSQL',
  summary:
    "What you're really choosing between: a relational model with joins and transactions vs. a data model shaped to one access pattern.",
  tags: ['databases'],
  section: 'databases-modeling',
  body,
  format: 'nugget',
};
