import Fuse from 'fuse.js';
import type { Nugget } from '@/types';

const FUSE_OPTIONS: ConstructorParameters<typeof Fuse<Nugget>>[1] = {
  keys: [
    { name: 'title', weight: 2 },
    { name: 'tags', weight: 1.5 },
    { name: 'body', weight: 1 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
};

export function searchNuggets(nuggets: Nugget[], query: string): Nugget[] {
  if (!query.trim()) return nuggets;
  const fuse = new Fuse(nuggets, FUSE_OPTIONS);
  return fuse.search(query).map((result) => result.item);
}
