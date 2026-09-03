import body from './open-knowledge-format.md?raw';
import type { Nugget } from '@/types';

export const openKnowledgeFormat: Nugget = {
  id: 'open-knowledge-format',
  title: 'Open Knowledge Format (OKF)',
  summary:
    'Hand-curated, cross-linked concept files loaded straight into context — an alternative to vector RAG for small, stable, authoritative knowledge.',
  tags: ['rag', 'patterns', 'tooling'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
