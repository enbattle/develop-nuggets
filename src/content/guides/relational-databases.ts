import body from './relational-databases.md?raw';
import type { Nugget } from '@/types';

export const relationalDatabases: Nugget = {
  id: 'relational-databases',
  title: 'Relational Databases',
  summary:
    'What an RDBMS gives you — the relational model, ACID transactions, indexes, joins — and how the planner turns SQL into work.',
  tags: ['databases', 'tooling'],
  section: 'data-stores',
  body,
  format: 'guide',
};
