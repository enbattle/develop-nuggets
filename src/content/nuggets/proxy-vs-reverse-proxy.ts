import body from './proxy-vs-reverse-proxy.md?raw';
import type { Nugget } from '@/types';

export const proxyVsReverseProxy: Nugget = {
  id: 'proxy-vs-reverse-proxy',
  title: 'Proxy vs. Reverse Proxy',
  summary:
    'Which side of the connection each one sits on, and what that placement enables — caching, TLS termination, load balancing, access control.',
  tags: ['networking', 'security', 'patterns'],
  section: 'networking',
  body,
  format: 'nugget',
};
