import body from './vector-databases.md?raw';
import type { Nugget } from '@/types';

export const vectorDatabases: Nugget = {
  id: 'vector-databases',
  title: 'Vector Databases',
  summary:
    'Storing embeddings and querying by nearest-neighbor similarity — the storage layer behind semantic search and RAG.',
  tags: ['databases', 'ai'],
  section: 'data-stores',
  body,
  format: 'nugget',
};
