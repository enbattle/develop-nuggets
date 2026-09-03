import body from './improvements-and-advanced.md?raw';
import type { Nugget } from '@/types';

export const improvementsAndAdvanced: Nugget = {
  id: 'improvements-and-advanced',
  title: 'Advanced RAG Techniques',
  summary:
    'The techniques that lift retrieval quality once the basics work: hybrid search, re-ranking, HyDE, query expansion, and multi-modal retrieval.',
  tags: ['rag', 'patterns', 'performance'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
