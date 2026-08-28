import body from './networking-protocols.md?raw';
import type { Nugget } from '@/types';

export const networkingProtocols: Nugget = {
  id: 'networking-protocols',
  title: 'Networking: Protocols',
  summary:
    'A tour of the protocol stack that matters to app developers: TCP vs. UDP, HTTP/1.1 through 3, TLS, and DNS.',
  tags: ['networking', 'apis'],
  section: 'networking',
  body,
  format: 'guide',
};
