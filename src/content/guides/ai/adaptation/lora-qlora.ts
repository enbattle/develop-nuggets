import body from './lora-qlora.md?raw';
import type { Nugget } from '@/types';

export const loraQlora: Nugget = {
  id: 'lora-qlora',
  title: 'LoRA and QLoRA',
  summary:
    'Fine-tuning big models on one GPU by training a small low-rank adapter instead of every weight — the math behind LoRA, its key hyperparameters, and QLoRA\'s 4-bit twist.',
  tags: ['ai', 'fine-tuning', 'performance'],
  section: 'ai-adaptation',
  body,
  format: 'guide',
};
