import body from './prompt-injection.md?raw';
import type { Nugget } from '@/types';

export const promptInjection: Nugget = {
  id: 'prompt-injection',
  title: 'Prompt Injection: Attack and Defense',
  summary:
    'How direct and indirect prompt injection work, why blocklists lose the arms race, and the defence-in-depth layers that actually help.',
  tags: ['ai', 'guardrails', 'security'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
