import body from './streaming-architecture.md?raw';
import type { Nugget } from '@/types';

export const streamingArchitecture: Nugget = {
  id: 'streaming-architecture',
  title: 'Streaming Architecture',
  summary:
    'Streaming LLM output token by token over SSE — the server endpoint, the browser consumer, streaming tool use, and the latency metrics that matter.',
  tags: ['ai', 'agents', 'web', 'performance'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
