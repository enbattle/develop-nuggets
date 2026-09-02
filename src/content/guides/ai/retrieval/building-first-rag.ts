import body from './building-first-rag.md?raw';
import type { Nugget } from '@/types';

export const buildingFirstRag: Nugget = {
  id: 'building-first-rag',
  title: 'Building Your First RAG',
  summary:
    'A minimal end-to-end RAG implementation you can run now, and the design choices that keep its answers grounded.',
  tags: ['rag', 'ai', 'embeddings'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
