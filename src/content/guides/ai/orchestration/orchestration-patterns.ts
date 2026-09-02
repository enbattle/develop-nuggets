import body from './orchestration-patterns.md?raw';
import type { Nugget } from '@/types';

export const orchestrationPatterns: Nugget = {
  id: 'orchestration-patterns',
  title: 'Orchestration Patterns',
  summary:
    'The handful of multi-agent composition patterns — orchestrator/subagents, pipeline, router, evaluator-optimizer — and when each one applies.',
  tags: ['agents', 'ai', 'patterns'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
