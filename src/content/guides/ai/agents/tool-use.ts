import body from './tool-use.md?raw';
import type { Nugget } from '@/types';

export const toolUse: Nugget = {
  id: 'tool-use',
  title: 'Tool Use & Function Calling',
  summary:
    'Designing the functions an agent calls: single responsibility, descriptions written for the model, safe-by-default mutations, and error handling.',
  tags: ['agents', 'patterns', 'apis'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
