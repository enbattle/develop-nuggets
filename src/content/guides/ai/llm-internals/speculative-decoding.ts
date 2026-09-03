import body from './speculative-decoding.md?raw';
import type { Nugget } from '@/types';

export const speculativeDecoding: Nugget = {
  id: 'speculative-decoding',
  title: 'Speculative Decoding',
  summary:
    'Using a small draft model to propose tokens a large model verifies in one pass — where the speedup comes from, what acceptance rate to expect, and when it backfires.',
  tags: ['ai', 'inference', 'performance'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
