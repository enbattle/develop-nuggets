import body from './evals-tools-and-frameworks.md?raw';
import type { Nugget } from '@/types';

export const evalsToolsAndFrameworks: Nugget = {
  id: 'evals-tools-and-frameworks',
  title: 'Tools & Frameworks',
  summary:
    'When to reach for RAGAS, LangSmith, or Braintrust versus a lightweight custom LLM-as-judge runner.',
  tags: ['ai', 'evals', 'testing', 'tooling'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
