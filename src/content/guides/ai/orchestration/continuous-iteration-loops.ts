import body from './continuous-iteration-loops.md?raw';
import type { Nugget } from '@/types';

export const continuousIterationLoops: Nugget = {
  id: 'continuous-iteration-loops',
  title: 'Continuous Iteration Loops (Ralph Pattern)',
  summary:
    'The Ralph pattern: restart an agent with a fresh context each cycle, using the file system as memory, until a task list is fully checked off.',
  tags: ['agents', 'ai', 'patterns', 'process'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
