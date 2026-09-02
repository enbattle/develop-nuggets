import body from './context-collapse.md?raw';
import type { Nugget } from '@/types';

export const contextCollapse: Nugget = {
  id: 'context-collapse',
  title: 'Context Collapse',
  summary:
    'Why models under-read the middle of a long prompt, where that hurts RAG, and how reranking, a smaller k, and query decomposition fight it.',
  tags: ['ai', 'rag', 'inference'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
