import body from './distillation.md?raw';
import type { Nugget } from '@/types';

export const distillation: Nugget = {
  id: 'distillation',
  title: 'Knowledge Distillation',
  summary:
    'Training a small student model to match a large teacher on one task — soft-target KL loss, API-only data-synthesis distillation, and stacking it with quantization.',
  tags: ['ai', 'fine-tuning', 'performance'],
  section: 'ai-adaptation',
  body,
  format: 'guide',
};
