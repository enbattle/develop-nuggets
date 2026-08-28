import body from './latency-vs-throughput.md?raw';
import type { Nugget } from '@/types';

export const latencyVsThroughput: Nugget = {
  id: 'latency-vs-throughput',
  title: 'Latency vs. Throughput',
  summary:
    'Two different performance numbers that trade off against each other — optimizing one can quietly wreck the other.',
  tags: ['performance'],
  section: 'foundations',
  body,
  format: 'nugget',
};
