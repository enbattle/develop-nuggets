import body from './idempotency.md?raw';
import type { Nugget } from '@/types';

export const idempotency: Nugget = {
  id: 'idempotency',
  title: 'Idempotency',
  summary:
    'Designing an operation so that retrying it is harmless — the property that makes safe retries possible on an unreliable network.',
  tags: ['apis', 'reliability'],
  section: 'reliability',
  body,
  format: 'nugget',
};
