import body from './cdn.md?raw';
import type { Nugget } from '@/types';

export const cdn: Nugget = {
  id: 'cdn',
  title: 'Networking: CDN',
  summary:
    "How a content delivery network caches your assets at the edge, what it can and can't cache, and how invalidation actually works.",
  tags: ['networking', 'performance'],
  section: 'networking',
  body,
  format: 'guide',
};
