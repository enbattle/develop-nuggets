import body from './evals-advanced-topics.md?raw';
import type { Nugget } from '@/types';

export const evalsAdvancedTopics: Nugget = {
  id: 'evals-advanced-topics',
  title: 'Regression & Adversarial Testing',
  summary:
    'Techniques for a mature eval program — multi-dimensional scoring, regression detection, shadow evaluation, adversarial suites, and judge calibration.',
  tags: ['ai', 'evals', 'testing', 'guardrails'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
