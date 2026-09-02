import body from './agentic-advanced-topics.md?raw';
import type { Nugget } from '@/types';

export const agenticAdvancedTopics: Nugget = {
  id: 'agentic-advanced-topics',
  title: 'Multi-Agent Systems',
  summary:
    'Patterns for larger agent systems: multi-agent orchestration, hierarchical planning, parallel tool calls, state machines, and observability.',
  tags: ['agents', 'patterns', 'reliability'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
