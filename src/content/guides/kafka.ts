import body from './kafka.md?raw';
import type { Nugget } from '@/types';

export const kafka: Nugget = {
  id: 'kafka',
  title: 'Kafka',
  summary:
    'A distributed append-only log: partitions, consumer groups, offsets, and why it became a backbone for event-driven systems.',
  tags: ['messaging', 'tooling'],
  section: 'messaging',
  body,
  format: 'guide',
};
