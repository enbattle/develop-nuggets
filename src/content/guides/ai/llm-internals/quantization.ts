import body from './quantization.md?raw';
import type { Nugget } from '@/types';

export const quantization: Nugget = {
  id: 'quantization',
  title: 'Quantization',
  summary:
    'Trading numeric precision for memory and speed — the formats (FP8, INT4, NF4), the methods (GPTQ, AWQ, GGUF), and which to pick for serving versus fine-tuning.',
  tags: ['ai', 'inference', 'performance'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
