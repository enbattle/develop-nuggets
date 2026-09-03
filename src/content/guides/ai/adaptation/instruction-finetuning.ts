import body from './instruction-finetuning.md?raw';
import type { Nugget } from '@/types';

export const instructionFinetuning: Nugget = {
  id: 'instruction-finetuning',
  title: 'Instruction Fine-Tuning & Data Curation',
  summary:
    'Teaching a base model to behave as an assistant — chat templates, curating (instruction, response) data, why quality beats quantity, and holding out an eval set.',
  tags: ['ai', 'fine-tuning', 'evals'],
  section: 'ai-adaptation',
  body,
  format: 'guide',
};
