import body from './networking-real-time-communication.md?raw';
import type { Nugget } from '@/types';

export const networkingRealTimeCommunication: Nugget = {
  id: 'networking-real-time-communication',
  title: 'Networking: Real-Time Communication',
  summary:
    'Pushing data to clients as it happens — polling, SSE, WebSockets, WebRTC — and the tradeoffs that decide between them.',
  tags: ['networking', 'apis', 'patterns'],
  section: 'networking',
  body,
  format: 'guide',
};
