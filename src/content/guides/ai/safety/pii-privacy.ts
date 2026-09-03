import body from './pii-privacy.md?raw';
import type { Nugget } from '@/types';

export const piiPrivacy: Nugget = {
  id: 'pii-privacy',
  title: 'PII Detection & Data Privacy',
  summary:
    'Catching PII where it enters an AI system — retrieved context, user input, and model output — plus secrets handling and detector tradeoffs.',
  tags: ['ai', 'guardrails', 'security', 'databases'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
