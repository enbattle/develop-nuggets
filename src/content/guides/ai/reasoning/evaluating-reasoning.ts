import body from './evaluating-reasoning.md?raw';
import type { Nugget } from '@/types';

export const evaluatingReasoning: Nugget = {
  id: 'evaluating-reasoning',
  title: 'Evaluating Reasoning Quality',
  summary:
    "Telling 'got the right answer' apart from 'reasoned correctly' — why standard benchmarks fall short, process versus outcome grading, and perturbation-robustness checks.",
  tags: ['ai', 'evals', 'prompting'],
  section: 'ai-reasoning',
  body,
  format: 'guide',
};
