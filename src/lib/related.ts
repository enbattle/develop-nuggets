import type { Nugget } from '@/types';

const DEFAULT_LIMIT = 3;

/**
 * Nuggets sharing the most tags with `nugget`, most-shared first (ties broken
 * by most recently updated). Purely tag-derived — any nugget with tags
 * participates automatically, no manual curation required.
 */
export function getRelatedNuggets(
  nugget: Nugget,
  allNuggets: Nugget[],
  limit = DEFAULT_LIMIT,
): Nugget[] {
  const tagSet = new Set(nugget.tags);

  return allNuggets
    .filter((candidate) => candidate.id !== nugget.id)
    .map((candidate) => ({
      candidate,
      sharedTags: candidate.tags.filter((tag) => tagSet.has(tag)).length,
    }))
    .filter(({ sharedTags }) => sharedTags > 0)
    .sort((a, b) => {
      if (b.sharedTags !== a.sharedTags) return b.sharedTags - a.sharedTags;
      return b.candidate.updatedAt.localeCompare(a.candidate.updatedAt);
    })
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}
