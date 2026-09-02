import body from './vector-databases.md?raw';
import type { Nugget } from '@/types';

export const vectorDatabases: Nugget = {
  id: 'vector-databases',
  title: 'Vector Databases',
  summary:
    'How approximate-nearest-neighbour search and HNSW indexes make embedding lookup fast, plus filtering, index freshness, and hosting tradeoffs.',
  tags: ['rag', 'databases', 'embeddings', 'performance'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
