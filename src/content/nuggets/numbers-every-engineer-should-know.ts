import body from './numbers-every-engineer-should-know.md?raw';
import type { Nugget } from '@/types';

export const numbersEveryEngineerShouldKnow: Nugget = {
  id: 'numbers-every-engineer-should-know',
  title: 'Numbers Every Engineer Should Know',
  summary:
    'The order-of-magnitude latencies — cache, memory, disk, network — that let you sanity-check a design on a napkin.',
  tags: ['performance', 'process'],
  section: 'foundations',
  body,
  format: 'nugget',
};
