import body from './when-to-finetune.md?raw';
import type { Nugget } from '@/types';

export const whenToFinetune: Nugget = {
  id: 'when-to-finetune',
  title: 'When to Fine-Tune vs. Everything Else',
  summary:
    'Choosing between prompting, RAG, fine-tuning, and continued pre-training — the tradeoffs, the common mistake of fine-tuning for knowledge, and a decision matrix.',
  tags: ['ai', 'fine-tuning', 'patterns'],
  section: 'ai-adaptation',
  body,
  format: 'guide',
};
