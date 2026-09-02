import body from './structured-outputs-finetuning.md?raw';
import type { Nugget } from '@/types';

export const structuredOutputsFinetuning: Nugget = {
  id: 'structured-outputs-finetuning',
  title: 'Fine-Tuning for Structured Outputs',
  summary:
    "When retries aren't enough: fine-tuning a smaller model for near-perfect schema compliance — building the dataset, and measuring more than parse rate.",
  tags: ['ai', 'fine-tuning', 'evals'],
  section: 'ai-adaptation',
  body,
  format: 'guide',
};
