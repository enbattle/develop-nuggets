import { describe, it, expect } from 'vitest';
import { CONTENT, getContent, contentPath } from './index';
import { NUGGETS } from './nuggets';
import { GUIDES } from './guides';
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

describe('CONTENT', () => {
  it('merges every nugget and every guide', () => {
    expect(CONTENT).toHaveLength(NUGGETS.length + GUIDES.length);
    expect(CONTENT).toEqual(expect.arrayContaining(NUGGETS));
    expect(CONTENT).toEqual(expect.arrayContaining(GUIDES));
  });
});

describe('getContent', () => {
  it('finds a nugget by id', () => {
    expect(getContent('idempotency')?.title).toBe('Idempotency');
  });

  it('finds a guide by id', () => {
    expect(getContent('redis')?.title).toBe('Redis');
  });

  it('returns undefined for an unknown id', () => {
    expect(getContent('does-not-exist')).toBeUndefined();
  });
});

describe('contentPath', () => {
  it('routes a nugget under /nuggets/:id', () => {
    expect(contentPath(nugget({ id: 'idempotency', format: 'nugget' }))).toBe(
      '/nuggets/idempotency',
    );
  });

  it('routes a guide under /guides/:id', () => {
    expect(contentPath(nugget({ id: 'redis', format: 'guide' }))).toBe(
      '/guides/redis',
    );
  });
});
