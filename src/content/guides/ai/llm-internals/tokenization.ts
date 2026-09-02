import body from './tokenization.md?raw';
import type { Nugget } from '@/types';

export const tokenization: Nugget = {
  id: 'tokenization',
  title: 'Tokenization',
  summary:
    'How text becomes the integer IDs a model actually sees — BPE, why token boundaries break letter-counting and arithmetic, and why non-English text costs more.',
  tags: ['ai', 'inference', 'prompting'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
