import body from './semantic-caching.md?raw';
import type { Nugget } from '@/types';

export const semanticCaching: Nugget = {
  id: 'semantic-caching',
  title: 'Semantic Caching',
  summary:
    'Serving a cached answer when a new query is semantically close to a past one, not only on an exact string match.',
  tags: ['rag', 'performance', 'embeddings'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
