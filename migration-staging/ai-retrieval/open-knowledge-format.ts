import body from './open-knowledge-format.md?raw';
import type { Nugget } from '@/types';

export const openKnowledgeFormat: Nugget = {
  id: 'open-knowledge-format',
  title: 'Open Knowledge Format (OKF)',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ['ai', 'databases', 'patterns', 'security'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
