import body from './evaluation-workflow.md?raw';
import type { Nugget } from '@/types';

export const evaluationWorkflow: Nugget = {
  id: 'evaluation-workflow',
  title: 'Evaluation Workflow',
  summary:
    'The full eval process from dev loop through pre-deploy gate to weekly production monitoring, wired as code.',
  tags: ['ai', 'evals', 'testing', 'process'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
