import body from './common-challenges.md?raw';
import type { Nugget } from '@/types';

export const commonChallenges: Nugget = {
  id: 'common-challenges',
  title: 'Common Challenges',
  summary:
    'The characteristic ways agents break — infinite loops, wrong tool, hallucinated calls, bad reasoning — and the guards that contain them.',
  tags: ['agents', 'reliability', 'patterns'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
