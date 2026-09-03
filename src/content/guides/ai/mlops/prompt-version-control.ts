import body from './prompt-version-control.md?raw';
import type { Nugget } from '@/types';

export const promptVersionControl: Nugget = {
  id: 'prompt-version-control',
  title: 'Prompt Version Control',
  summary:
    'Getting prompts out of application code and under version control — prompts as config, dedicated platforms, semantic versioning, and A/B testing.',
  tags: ['ai', 'mlops', 'prompting', 'process'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
