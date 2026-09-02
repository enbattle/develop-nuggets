import body from './prompt-injection.md?raw';
import type { Nugget } from '@/types';

export const promptInjection: Nugget = {
  id: 'prompt-injection',
  title: 'Prompt Injection: Attack and Defense',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ['ai', 'databases', 'security'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
