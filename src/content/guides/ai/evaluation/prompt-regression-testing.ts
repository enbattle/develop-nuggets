import body from './prompt-regression-testing.md?raw';
import type { Nugget } from '@/types';

export const promptRegressionTesting: Nugget = {
  id: 'prompt-regression-testing',
  title: 'Prompt Regression Testing',
  summary:
    'Treating prompts as code — a suite of input/assertion/threshold cases that runs on every prompt change to catch regressions in CI.',
  tags: ['ai', 'evals', 'testing', 'prompting'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
