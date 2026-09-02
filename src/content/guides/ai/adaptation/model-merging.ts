import body from './model-merging.md?raw';
import type { Nugget } from '@/types';

export const modelMerging: Nugget = {
  id: 'model-merging',
  title: 'Model Merging',
  summary:
    'Combining several fine-tuned models into one with no extra training — weight averaging, task vectors, and sign-conflict methods like TIES and DARE.',
  tags: ['ai', 'fine-tuning', 'patterns'],
  section: 'ai-adaptation',
  body,
  format: 'guide',
};
