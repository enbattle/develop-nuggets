import body from './human-in-the-loop.md?raw';
import type { Nugget } from '@/types';

export const humanInTheLoop: Nugget = {
  id: 'human-in-the-loop',
  title: 'Human-in-the-Loop',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ['ai', 'patterns', 'performance', 'process'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
