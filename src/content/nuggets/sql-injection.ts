import body from './sql-injection.md?raw';
import type { Nugget } from '@/types';

export const sqlInjection: Nugget = {
  id: 'sql-injection',
  title: 'SQL Injection & Parameterized Queries',
  summary:
    'How unsanitized input becomes executable SQL, and why parameterized queries — not manual escaping — are the fix.',
  tags: ['security', 'databases'],
  section: 'security-auth',
  body,
  format: 'nugget',
};
