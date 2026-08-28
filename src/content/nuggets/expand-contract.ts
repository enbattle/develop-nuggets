import body from './expand-contract.md?raw';
import type { Nugget } from '@/types';

export const expandContract: Nugget = {
  id: 'expand-contract',
  title: 'Expand-Contract Pattern',
  summary:
    'Rolling out a breaking schema or API change in three safe phases so old and new code keep working throughout the migration.',
  tags: ['patterns', 'migrations'],
  section: 'delivery',
  body,
  format: 'nugget',
};
