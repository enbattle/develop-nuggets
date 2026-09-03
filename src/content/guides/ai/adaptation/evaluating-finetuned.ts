import body from './evaluating-finetuned.md?raw';
import type { Nugget } from '@/types';

export const evaluatingFinetuned: Nugget = {
  id: 'evaluating-finetuned',
  title: 'Evaluating Fine-Tuned Models',
  summary:
    "Checking a fine-tune didn't quietly break something else — held-out test sets, catastrophic-forgetting regression checks, contamination risk, and a hosting-versus-API cost model.",
  tags: ['ai', 'fine-tuning', 'evals'],
  section: 'ai-adaptation',
  body,
  format: 'guide',
};
