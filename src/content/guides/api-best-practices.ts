import body from './api-best-practices.md?raw';
import type { Nugget } from '@/types';

export const apiBestPractices: Nugget = {
  id: 'api-best-practices',
  title: 'APIs: Best Practices',
  summary:
    'A checklist for designing an HTTP API others can live with: naming, versioning, errors, pagination, auth, idempotency.',
  tags: ['apis', 'security', 'reliability'],
  section: 'apis-communication',
  body,
  format: 'guide',
};
