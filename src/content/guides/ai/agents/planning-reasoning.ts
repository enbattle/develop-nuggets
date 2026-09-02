import body from './planning-reasoning.md?raw';
import type { Nugget } from '@/types';

export const planningReasoning: Nugget = {
  id: 'planning-reasoning',
  title: 'Planning & Reasoning',
  summary:
    'Three ways an agent sequences its actions — ReAct, plan-and-execute, self-reflection — and when each one fits the task.',
  tags: ['agents', 'patterns', 'prompting'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
