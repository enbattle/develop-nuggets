import { describe, it, expect } from 'vitest';
import { getRelatedNuggets } from './related';
import type { Nugget } from '@/types';

function nugget(id: string, tags: string[], updatedAt: string): Nugget {
  return { id, title: id, body: '', tags, updatedAt };
}

describe('getRelatedNuggets', () => {
  it('ranks by number of shared tags, most first', () => {
    const target = nugget('a', ['reliability', 'apis'], '2026-01-01');
    const twoShared = nugget('b', ['reliability', 'apis'], '2026-01-01');
    const oneShared = nugget('c', ['reliability'], '2026-01-01');
    const unrelated = nugget('d', ['databases'], '2026-01-01');

    const result = getRelatedNuggets(target, [
      target,
      unrelated,
      oneShared,
      twoShared,
    ]);

    expect(result.map((n) => n.id)).toEqual(['b', 'c']);
  });

  it('excludes the nugget itself', () => {
    const target = nugget('a', ['patterns'], '2026-01-01');
    const result = getRelatedNuggets(target, [target]);
    expect(result).toEqual([]);
  });

  it('breaks ties by most recently updated', () => {
    const target = nugget('a', ['patterns'], '2026-01-01');
    const older = nugget('b', ['patterns'], '2025-01-01');
    const newer = nugget('c', ['patterns'], '2026-06-01');

    const result = getRelatedNuggets(target, [target, older, newer]);

    expect(result.map((n) => n.id)).toEqual(['c', 'b']);
  });

  it('respects the limit', () => {
    const target = nugget('a', ['patterns'], '2026-01-01');
    const others = ['b', 'c', 'd', 'e'].map((id) =>
      nugget(id, ['patterns'], '2026-01-01'),
    );

    const result = getRelatedNuggets(target, [target, ...others], 2);

    expect(result).toHaveLength(2);
  });
});
