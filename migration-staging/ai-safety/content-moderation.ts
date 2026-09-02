import body from './content-moderation.md?raw';
import type { Nugget } from '@/types';

export const contentModeration: Nugget = {
  id: 'content-moderation',
  title: 'Content Moderation Pipelines',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ['ai', 'security'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
