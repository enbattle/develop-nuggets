import { describe, it, expect } from 'vitest';
import { getRelatedNuggets } from './related';
import type { Nugget } from '@/types';

function nugget(id: string, tags: string[], title = id): Nugget {
  return { id, title, body: '', tags };
}

describe('getRelatedNuggets', () => {
  it('ranks by number of shared tags, most first', () => {
    const target = nugget('a', ['reliability', 'apis']);
    const twoShared = nugget('b', ['reliability', 'apis']);
    const oneShared = nugget('c', ['reliability']);
    const unrelated = nugget('d', ['databases']);

    const result = getRelatedNuggets(target, [
      target,
      unrelated,
      oneShared,
      twoShared,
    ]);

    expect(result.map((n) => n.id)).toEqual(['b', 'c']);
  });

  it('excludes the nugget itself', () => {
    const target = nugget('a', ['patterns']);
    const result = getRelatedNuggets(target, [target]);
    expect(result).toEqual([]);
  });

  it('breaks ties alphabetically by title', () => {
    const target = nugget('a', ['patterns'], 'Target');
    const zebra = nugget('b', ['patterns'], 'Zebra');
    const apple = nugget('c', ['patterns'], 'Apple');

    const result = getRelatedNuggets(target, [target, zebra, apple]);

    expect(result.map((n) => n.id)).toEqual(['c', 'b']);
  });

  it('respects the limit', () => {
    const target = nugget('a', ['patterns']);
    const others = ['b', 'c', 'd', 'e'].map((id) => nugget(id, ['patterns']));

    const result = getRelatedNuggets(target, [target, ...others], 2);

    expect(result).toHaveLength(2);
  });
});
