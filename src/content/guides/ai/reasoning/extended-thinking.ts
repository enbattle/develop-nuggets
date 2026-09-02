import body from './extended-thinking.md?raw';
import type { Nugget } from '@/types';

export const extendedThinking: Nugget = {
  id: 'extended-thinking',
  title: 'Extended Thinking in Claude',
  summary:
    "Claude's configurable thinking budget: the thinking API block, streaming it, picking a budget_tokens value, and why heavy prompt scaffolding works against it.",
  tags: ['ai', 'prompting', 'inference'],
  section: 'ai-reasoning',
  body,
  format: 'guide',
};
