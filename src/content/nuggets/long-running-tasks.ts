import body from './long-running-tasks.md?raw';
import type { Nugget } from '@/types';

export const longRunningTasks: Nugget = {
  id: 'long-running-tasks',
  title: 'Managing Long-Running Tasks',
  summary:
    'Getting slow work off the request path with a job queue and a status endpoint, instead of holding an HTTP connection open.',
  tags: ['patterns', 'apis', 'reliability'],
  section: 'messaging',
  body,
  format: 'nugget',
};
