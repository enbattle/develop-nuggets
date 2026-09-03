import body from './reward-models.md?raw';
import type { Nugget } from '@/types';

export const rewardModels: Nugget = {
  id: 'reward-models',
  title: 'Process vs. Outcome Reward Models',
  summary:
    'How reasoning training gets its signal — scoring the final answer (ORM) versus every step (PRM), best-of-N sampling at inference, and building a lightweight verifier.',
  tags: ['ai', 'fine-tuning', 'evals'],
  section: 'ai-reasoning',
  body,
  format: 'guide',
};
