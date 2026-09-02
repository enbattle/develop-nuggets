import body from './dpo.md?raw';
import type { Nugget } from '@/types';

export const dpo: Nugget = {
  id: 'dpo',
  title: 'DPO: Direct Preference Optimization',
  summary:
    'Preference-tuning a model without full RLHF — training directly on chosen/rejected pairs, collecting that data, a TRL training loop, and how DPO compares to PPO and GRPO.',
  tags: ['ai', 'fine-tuning', 'evals'],
  section: 'ai-adaptation',
  body,
  format: 'guide',
};
