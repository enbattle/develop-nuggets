import body from './knowledge-architecture.md?raw';
import type { Nugget } from '@/types';

export const knowledgeArchitecture: Nugget = {
  id: 'knowledge-architecture',
  title: 'Knowledge Architecture',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ['ai', 'patterns', 'performance', 'security'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
