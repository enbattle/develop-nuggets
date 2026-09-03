import body from './late-chunking.md?raw';
import type { Nugget } from '@/types';

export const lateChunking: Nugget = {
  id: 'late-chunking',
  title: 'Late Chunking',
  summary:
    'Embedding a full document before splitting it, so each chunk vector keeps the surrounding context that independent chunk embedding throws away.',
  tags: ['rag', 'embeddings', 'patterns'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
