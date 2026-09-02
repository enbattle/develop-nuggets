import body from './kv-cache.md?raw';
import type { Nugget } from '@/types';

export const kvCache: Nugget = {
  id: 'kv-cache',
  title: 'KV Cache',
  summary:
    'Why generation stays linear instead of quadratic — the cache that holds past attention, what it costs in memory, and the tricks (GQA, paging, prefix reuse) that keep it affordable.',
  tags: ['ai', 'inference', 'performance'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
