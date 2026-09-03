import body from './durable-execution.md?raw';
import type { Nugget } from '@/types';

export const durableExecution: Nugget = {
  id: 'durable-execution',
  title: 'Durable Execution',
  summary:
    'Workflow engines like Temporal that checkpoint each step to durable storage, so a crashed or paused run resumes where it left off instead of restarting.',
  tags: ['agents', 'ai', 'reliability', 'patterns'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
