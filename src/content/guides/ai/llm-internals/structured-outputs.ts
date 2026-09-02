import body from './structured-outputs.md?raw';
import type { Nugget } from '@/types';

export const structuredOutputs: Nugget = {
  id: 'structured-outputs',
  title: 'Structured Outputs',
  summary:
    'Getting reliable JSON out of an LLM — forced tool use, Instructor plus Pydantic, and grammar-constrained decoding, ranked by how they fail at scale.',
  tags: ['ai', 'inference', 'tooling'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
