import { describe, it, expect } from 'vitest';
import { CURATED, curatedItems } from './curated';
import { getContent } from './index';
import { sectionDomain } from '@/lib/sections';

describe('curated', () => {
  it('every id resolves to a content item', () => {
    for (const id of CURATED) {
      expect(getContent(id), `curated id "${id}" does not resolve`).toBeDefined();
    }
  });

  it('curatedItems() returns one item per id, in order', () => {
    const items = curatedItems();
    expect(items).toHaveLength(CURATED.length);
    expect(items.map((item) => item.id)).toEqual(CURATED);
  });

  it('spans both domains', () => {
    const domains = new Set(
      curatedItems().map((item) => sectionDomain(item.section)),
    );
    expect(domains).toContain('systems');
    expect(domains).toContain('ai');
  });
});
