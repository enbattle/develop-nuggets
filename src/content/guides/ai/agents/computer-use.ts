import body from './computer-use.md?raw';
import type { Nugget } from '@/types';

export const computerUse: Nugget = {
  id: 'computer-use',
  title: 'Computer Use & GUI Agents',
  summary:
    'Driving a GUI by screenshots and synthetic clicks when no API exists — how the loop works and why it is a last resort.',
  tags: ['agents', 'tooling', 'web'],
  section: 'ai-agents',
  body,
  format: 'guide',
};
