import body from './reasoning-models.md?raw';
import type { Nugget } from '@/types';

export const reasoningModels: Nugget = {
  id: 'reasoning-models',
  title: 'What are Reasoning Models?',
  summary:
    'When to reach for a model that spends inference-time compute thinking before it answers — what thinking tokens are, what they cost, and where they beat a bigger standard model.',
  tags: ['ai', 'inference', 'prompting'],
  section: 'ai-reasoning',
  body,
  format: 'guide',
};
