import body from './evaluation-metrics.md?raw';
import type { Nugget } from '@/types';

export const evaluationMetrics: Nugget = {
  id: 'evaluation-metrics',
  title: 'RAG Evaluation',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ['ai', 'databases', 'patterns', 'performance'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
