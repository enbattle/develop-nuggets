import body from './rag-pipeline.md?raw';
import type { Nugget } from '@/types';

export const ragPipeline: Nugget = {
  id: 'rag-pipeline',
  title: 'The RAG Pipeline',
  summary:
    'The two phases of a RAG system — offline indexing and per-query retrieval — and the five components you tune across them.',
  tags: ['rag', 'ai', 'embeddings', 'databases'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
