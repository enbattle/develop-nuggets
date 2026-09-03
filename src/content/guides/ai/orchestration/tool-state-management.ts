import body from './tool-state-management.md?raw';
import type { Nugget } from '@/types';

export const toolStateManagement: Nugget = {
  id: 'tool-state-management',
  title: 'Tool & State Management',
  summary:
    "Making an agent's tool calls and state survive production — typed tool boundaries, rate limits, step checkpointing, token-budget trimming, and side-effect gating.",
  tags: ['agents', 'ai', 'reliability', 'tooling'],
  section: 'ai-orchestration',
  body,
  format: 'guide',
};
