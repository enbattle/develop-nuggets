import body from './code-agents.md?raw';
import type { Nugget } from '@/types';

export const codeAgents: Nugget = {
  id: 'code-agents',
  title: 'Code Agents',
  summary:
    'Agents that write code, run it, and iterate on the errors — the execute-observe loop, sandboxing, and the patterns that make it work.',
  tags: ['agents', 'tooling', 'testing'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
