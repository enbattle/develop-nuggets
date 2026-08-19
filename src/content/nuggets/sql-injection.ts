import body from './sql-injection.md?raw';
import type { Nugget } from '@/types';

export const sqlInjection: Nugget = {
  id: 'sql-injection',
  title: 'SQL Injection & Parameterized Queries',
  tags: ['security', 'databases'],
  body,
  format: 'nugget',
};
