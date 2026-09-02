import body from './content-moderation.md?raw';
import type { Nugget } from '@/types';

export const contentModeration: Nugget = {
  id: 'content-moderation',
  title: 'Content Moderation Pipelines',
  summary:
    'Screening inputs and outputs for harmful content — classifier-based moderation, threshold tuning, tiered pipelines, and human escalation.',
  tags: ['ai', 'guardrails', 'security'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
