import body from './evaluation-metrics.md?raw';
import type { Nugget } from '@/types';

export const evaluationMetrics: Nugget = {
  id: 'evaluation-metrics',
  title: 'RAG Evaluation',
  summary:
    'How to measure a RAG system: retrieval precision and recall, answer faithfulness, latency budgets, and the eval dataset to track them against.',
  tags: ['rag', 'evals', 'testing'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
