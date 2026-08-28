import body from './database-indexing.md?raw';
import type { Nugget } from '@/types';

export const databaseIndexing: Nugget = {
  id: 'database-indexing',
  title: 'Database Indexing',
  summary:
    'How an index turns a full scan into a lookup, what it costs on every write, and when the query planner ignores the one you added.',
  tags: ['databases', 'performance'],
  section: 'databases-modeling',
  body,
  format: 'nugget',
};
