import body from './voice-agents.md?raw';
import type { Nugget } from '@/types';

export const voiceAgents: Nugget = {
  id: 'voice-agents',
  title: 'Voice Agents & Real-Time AI',
  summary:
    'Building a low-latency speech loop: cascade vs. native real-time architectures, the sub-500ms latency budget, turn detection, and interruptions.',
  tags: ['agents', 'performance', 'networking'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
