import body from './knowledge-architecture.md?raw';
import type { Nugget } from '@/types';

export const knowledgeArchitecture: Nugget = {
  id: 'knowledge-architecture',
  title: 'Knowledge Architecture',
  summary:
    'Layering semantic cache, curated concepts, vector RAG, and a knowledge graph into one retrieval stack, cheapest tier first.',
  tags: ['rag', 'patterns', 'databases'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
