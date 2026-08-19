import type { Nugget } from '@/types';
import { NUGGETS } from './nuggets';
import { GUIDES } from './guides';

/** Every nugget and guide, in one list — for search, the sidebar, and lookup by id. */
export const CONTENT: Nugget[] = [...NUGGETS, ...GUIDES];

export function getContent(id: string): Nugget | undefined {
  return CONTENT.find((item) => item.id === id);
}

/** Route path for a content item, format-aware (`/nuggets/:id` vs `/guides/:id`). */
export function contentPath(item: Nugget): string {
  return `/${item.format === 'guide' ? 'guides' : 'nuggets'}/${item.id}`;
}
