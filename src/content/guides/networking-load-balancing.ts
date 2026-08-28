import body from './networking-load-balancing.md?raw';
import type { Nugget } from '@/types';

export const networkingLoadBalancing: Nugget = {
  id: 'networking-load-balancing',
  title: 'Networking: Load Balancing',
  summary:
    'How traffic gets spread across servers — L4 vs. L7, the algorithms, health checks — and where the balancer itself sits.',
  tags: ['networking', 'reliability', 'performance'],
  section: 'networking',
  body,
  format: 'guide',
};
