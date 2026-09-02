import body from './vector-search.md?raw';
import type { Nugget } from '@/types';

export const vectorSearch: Nugget = {
  id: 'vector-search',
  title: 'Vector Search',
  summary:
    'How approximate-nearest-neighbour search and HNSW indexes make embedding lookup fast, plus filtering, index freshness, and hosting tradeoffs.',
  tags: ['rag', 'databases', 'embeddings', 'performance'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
