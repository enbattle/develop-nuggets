import body from './common-issues.md?raw';
import type { Nugget } from '@/types';

export const commonIssues: Nugget = {
  id: 'common-issues',
  title: 'Common Issues & Solutions',
  summary:
    'The five recurring RAG failure modes — hallucination, missed context, noise, latency, staleness — and the concrete fix for each.',
  tags: ['rag', 'patterns', 'reliability'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
