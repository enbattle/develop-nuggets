import body from './chunking-strategies.md?raw';
import type { Nugget } from '@/types';

export const chunkingStrategies: Nugget = {
  id: 'chunking-strategies',
  title: 'Chunking Strategies',
  summary:
    'The five ways to split documents before indexing, and which to reach for given your document type and retrieval-quality budget.',
  tags: ['rag', 'embeddings', 'patterns'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
