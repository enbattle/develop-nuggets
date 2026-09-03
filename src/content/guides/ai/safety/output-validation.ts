import body from './output-validation.md?raw';
import type { Nugget } from '@/types';

export const outputValidation: Nugget = {
  id: 'output-validation',
  title: 'Output Validation & Structured Safety',
  summary:
    'Constraining LLM output before it acts — Pydantic schema enforcement with retry, grammar-constrained decoding, confidence-based abstention, and refusal detection.',
  tags: ['ai', 'guardrails', 'reliability', 'tooling'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
