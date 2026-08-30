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

// Building the Fuse index is the expensive part; the list it's built from
// (`CONTENT`) is a stable module constant, so cache one index per array
// identity rather than rebuilding it on every keystroke. A WeakMap keeps
// short-lived arrays (e.g. per-test fixtures) from leaking.
const indexCache = new WeakMap<Nugget[], Fuse<Nugget>>();

export function searchNuggets(nuggets: Nugget[], query: string): Nugget[] {
  if (!query.trim()) return nuggets;
  let fuse = indexCache.get(nuggets);
  if (!fuse) {
    fuse = new Fuse(nuggets, FUSE_OPTIONS);
    indexCache.set(nuggets, fuse);
  }
  return fuse.search(query).map((result) => result.item);
}
