import body from './rag-fusion.md?raw';
import type { Nugget } from '@/types';

export const ragFusion: Nugget = {
  id: 'rag-fusion',
  title: 'RAG Fusion',
  summary:
    'Running several rephrasings of a query and merging their result lists with Reciprocal Rank Fusion to surface consistently-relevant documents.',
  tags: ['rag', 'patterns', 'performance'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
