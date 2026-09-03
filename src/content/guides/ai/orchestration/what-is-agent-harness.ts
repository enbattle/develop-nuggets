import body from './what-is-agent-harness.md?raw';
import type { Nugget } from '@/types';

export const whatIsAgentHarness: Nugget = {
  id: 'what-is-agent-harness',
  title: 'What is an Agent Harness?',
  summary:
    "The runtime layer that wraps an agent's LLM loop with retries, timeouts, checkpointing, and tracing — and the signs you've outgrown a hand-rolled loop.",
  tags: ['agents', 'ai', 'patterns', 'reliability'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
