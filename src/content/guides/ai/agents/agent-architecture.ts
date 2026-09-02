import body from './agent-architecture.md?raw';
import type { Nugget } from '@/types';

export const agentArchitecture: Nugget = {
  id: 'agent-architecture',
  title: 'Agent Architecture',
  summary:
    'The parts of a working agent: the reasoning loop, the tool registry, the memory tiers, and the orchestrator that drives them.',
  tags: ['agents', 'patterns', 'ai'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
