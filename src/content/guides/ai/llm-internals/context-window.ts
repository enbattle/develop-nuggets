import body from './context-window.md?raw';
import type { Nugget } from '@/types';

export const contextWindow: Nugget = {
  id: 'context-window',
  title: 'Context Window',
  summary:
    'The shared token budget every call draws on — how input and output compete for it, what it costs, and how to hold the line with trimming, summarization, or retrieval.',
  tags: ['ai', 'inference', 'rag', 'performance'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
