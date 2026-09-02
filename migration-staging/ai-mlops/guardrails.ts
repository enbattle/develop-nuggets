import body from './guardrails.md?raw';
import type { Nugget } from '@/types';

export const guardrails: Nugget = {
  id: 'guardrails',
  title: 'Guardrails',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ['ai', 'performance', 'process', 'reliability'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
