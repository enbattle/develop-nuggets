import body from './observability-tracing.md?raw';
import type { Nugget } from '@/types';

export const observabilityTracing: Nugget = {
  id: 'observability-tracing',
  title: 'Observability & Tracing',
  summary:
    'Making a non-deterministic agent run debuggable — span trees over LLM and tool calls, structured logs, and per-run cost attribution.',
  tags: ['agents', 'ai', 'reliability', 'tooling'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
