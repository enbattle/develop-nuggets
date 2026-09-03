import { describe, it, expect } from 'vitest';
import { CONTENT, getContent, contentPath } from './index';
import { NUGGETS } from './nuggets';
import { GUIDES } from './guides';
import { SECTION_ORDER } from '@/lib/sections';
import type { Nugget } from '@/types';

function nugget(overrides: Partial<Nugget>): Nugget {
  return {
    id: 'id',
    title: 'Title',
    summary: 'A one-line summary.',
    body: 'body',
    tags: [],
    section: 'foundations',
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

describe('section assignments', () => {
  it('files every content item under a known section', () => {
    const known = new Set(SECTION_ORDER);
    const orphans = CONTENT.filter((item) => !known.has(item.section));
    expect(orphans.map((item) => `${item.id} → ${item.section}`)).toEqual([]);
  });

  it('leaves no section in SECTION_ORDER empty', () => {
    const used = new Set(CONTENT.map((item) => item.section));
    const empty = SECTION_ORDER.filter((section) => !used.has(section));
    expect(empty).toEqual([]);
  });

  it('gives every item a non-empty one-line summary', () => {
    const missing = CONTENT.filter((item) => !item.summary.trim());
    expect(missing.map((item) => item.id)).toEqual([]);
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
