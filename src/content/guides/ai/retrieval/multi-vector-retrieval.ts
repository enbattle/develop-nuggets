import body from './multi-vector-retrieval.md?raw';
import type { Nugget } from '@/types';

export const multiVectorRetrieval: Nugget = {
  id: 'multi-vector-retrieval',
  title: 'Multi-Vector Retrieval (ColBERT/ColPali)',
  summary:
    'Keeping one embedding per token or image patch (ColBERT, ColPali) for fine-grained matching that single-vector search loses.',
  tags: ['rag', 'embeddings', 'performance'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
