import body from './what-are-evals.md?raw';
import type { Nugget } from '@/types';

export const whatAreEvals: Nugget = {
  id: 'what-are-evals',
  title: 'What are Evals?',
  summary:
    'Why an AI system needs automated evals the way code needs unit tests, and the loop that turns eval results into improvements.',
  tags: ['ai', 'evals', 'testing', 'process'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
