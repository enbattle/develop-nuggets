import body from './framework-landscape.md?raw';
import type { Nugget } from '@/types';

export const frameworkLandscape: Nugget = {
  id: 'framework-landscape',
  title: 'Framework Landscape',
  summary:
    'A tour of the agent-orchestration frameworks — LangGraph, the Claude Agent SDK, Bedrock and Vertex, CrewAI — and which one fits which control-versus-convenience tradeoff.',
  tags: ['agents', 'ai', 'tooling'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
