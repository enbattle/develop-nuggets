import { describe, it, expect } from 'vitest';
import { searchNuggets } from './search';
import type { Nugget } from '@/types';

function nugget(overrides: Partial<Nugget>): Nugget {
  return {
    id: 'id',
    title: 'Title',
    body: 'body',
    tags: [],
    format: 'nugget',
    ...overrides,
  };
}

const nuggets: Nugget[] = [
  nugget({
    id: 'expand-contract',
    title: 'Expand-Contract Pattern',
    tags: ['patterns', 'migrations'],
    body: 'Ship both shapes at once, migrate, then remove the old one.',
  }),
  nugget({
    id: 'idempotency',
    title: 'Idempotency',
    tags: ['apis', 'reliability'],
    body: 'An operation is idempotent if running it twice has the same effect as once.',
  }),
];

describe('searchNuggets', () => {
  it('returns every nugget for an empty or whitespace-only query', () => {
    expect(searchNuggets(nuggets, '')).toEqual(nuggets);
    expect(searchNuggets(nuggets, '   ')).toEqual(nuggets);
  });

  it('matches by title', () => {
    const results = searchNuggets(nuggets, 'idempotency');
    expect(results.map((n) => n.id)).toEqual(['idempotency']);
  });

  it('matches by tag', () => {
    const results = searchNuggets(nuggets, 'migrations');
    expect(results.map((n) => n.id)).toContain('expand-contract');
  });

  it('returns nothing for a query that matches no nugget', () => {
    expect(searchNuggets(nuggets, 'kubernetes')).toEqual([]);
  });
});
