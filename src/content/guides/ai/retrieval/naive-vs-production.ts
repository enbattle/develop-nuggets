import body from './naive-vs-production.md?raw';
import type { Nugget } from '@/types';

export const naiveVsProduction: Nugget = {
  id: 'naive-vs-production',
  title: 'Naive vs Production RAG',
  summary:
    'What a demo RAG pipeline is missing — query rewriting, hybrid search, re-ranking, monitoring — and a checklist for closing the gap.',
  tags: ['rag', 'patterns', 'performance', 'reliability'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
