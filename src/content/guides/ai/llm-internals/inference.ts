import body from './inference.md?raw';
import type { Nugget } from '@/types';

export const inference: Nugget = {
  id: 'inference',
  title: 'Inference',
  summary:
    'What actually happens when you call an LLM: the prefill/decode split, the throughput-vs-latency tradeoff, continuous batching, and the frameworks that serve it.',
  tags: ['ai', 'inference', 'performance'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
