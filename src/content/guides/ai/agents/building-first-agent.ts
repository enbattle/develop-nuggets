import body from './building-first-agent.md?raw';
import type { Nugget } from '@/types';

export const buildingFirstAgent: Nugget = {
  id: 'building-first-agent',
  title: 'Building Your First Agent',
  summary:
    'A complete ReAct agent built on the Anthropic tool-use API, from tool definitions through the reason-act-observe loop.',
  tags: ['agents', 'ai', 'patterns'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
