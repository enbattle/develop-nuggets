import body from './human-in-the-loop.md?raw';
import type { Nugget } from '@/types';

export const humanInTheLoop: Nugget = {
  id: 'human-in-the-loop',
  title: 'Human-in-the-Loop',
  summary:
    'Pausing an agent mid-run for human approval and resuming cleanly from a checkpoint — when to interrupt, and how to keep interruptions rare.',
  tags: ['agents', 'ai', 'process', 'patterns'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
