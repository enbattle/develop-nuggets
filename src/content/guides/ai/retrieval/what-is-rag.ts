import body from './what-is-rag.md?raw';
import type { Nugget } from '@/types';

export const whatIsRag: Nugget = {
  id: 'what-is-rag',
  title: 'What is RAG?',
  summary:
    "Why you retrieve documents into an LLM's context instead of fine-tuning or relying on a long prompt, and when each approach wins.",
  tags: ['rag', 'ai', 'embeddings'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
