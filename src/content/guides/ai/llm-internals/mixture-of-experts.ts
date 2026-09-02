import body from './mixture-of-experts.md?raw';
import type { Nugget } from '@/types';

export const mixtureOfExperts: Nugget = {
  id: 'mixture-of-experts',
  title: 'Mixture of Experts',
  summary:
    'How routing each token to a few expert sub-networks lets a model carry far more parameters than it activates — and what that means for serving memory and quantization.',
  tags: ['ai', 'inference', 'performance'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
