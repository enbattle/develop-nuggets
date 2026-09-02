import body from './essential-metrics.md?raw';
import type { Nugget } from '@/types';

export const essentialMetrics: Nugget = {
  id: 'essential-metrics',
  title: 'Essential Metrics',
  summary:
    'The metrics worth tracking for generation and retrieval — exact match, BLEU/ROUGE, precision and recall at k, MRR, faithfulness — with reference thresholds.',
  tags: ['ai', 'evals', 'testing', 'rag'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
