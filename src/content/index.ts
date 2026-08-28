import type { Nugget, Section } from '@/types';
import { SECTION_ORDER } from '@/lib/sections';
import { NUGGETS } from './nuggets';
import { GUIDES } from './guides';

/** Every nugget and guide, in one list — for search, the sidebar, and lookup by id. */
export const CONTENT: Nugget[] = [...NUGGETS, ...GUIDES];

/**
 * Content grouped by section, in `SECTION_ORDER`, guides before nuggets and
 * alphabetical by title within each — the shape both the sidebar and the home
 * page render. Sections with no items are omitted.
 */
export function contentBySection(
  items: Nugget[] = CONTENT,
): { section: Section; items: Nugget[] }[] {
  return SECTION_ORDER.map((section) => ({
    section,
    items: items
      .filter((item) => item.section === section)
      .sort((a, b) => {
        if (a.format !== b.format) return a.format === 'guide' ? -1 : 1;
        return a.title.localeCompare(b.title);
      }),
  })).filter((group) => group.items.length > 0);
}

export function getContent(id: string): Nugget | undefined {
  return CONTENT.find((item) => item.id === id);
}

/**
 * The items immediately before and after `item` within its own section,
 * using the same order the sidebar and home page show (`contentBySection`).
 * `null` at either end. Powers the prev/next pager on `ContentPage`.
 */
export function sectionNeighbors(item: Nugget): {
  prev: Nugget | null;
  next: Nugget | null;
} {
  const group = contentBySection().find((g) => g.section === item.section);
  const list = group?.items ?? [];
  const i = list.findIndex((x) => x.id === item.id);
  return {
    prev: i > 0 ? list[i - 1] : null,
    next: i >= 0 && i < list.length - 1 ? list[i + 1] : null,
  };
}

/** Route path for a content item, format-aware (`/nuggets/:id` vs `/guides/:id`). */
export function contentPath(item: Nugget): string {
  return `/${item.format === 'guide' ? 'guides' : 'nuggets'}/${item.id}`;
}
