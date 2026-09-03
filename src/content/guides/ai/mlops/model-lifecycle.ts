import body from './model-lifecycle.md?raw';
import type { Nugget } from '@/types';

export const modelLifecycle: Nugget = {
  id: 'model-lifecycle',
  title: 'Model Lifecycle Management',
  summary:
    'Managing models from experiment to retirement — experiment tracking, a versioned registry, automated retraining triggers, and deprecation.',
  tags: ['ai', 'mlops', 'process', 'reliability'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
