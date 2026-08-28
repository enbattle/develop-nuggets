import body from './circuit-breaker.md?raw';
import type { Nugget } from '@/types';

export const circuitBreaker: Nugget = {
  id: 'circuit-breaker',
  title: 'Circuit Breaker',
  summary:
    "Stop hammering a failing dependency by 'tripping' after repeated errors, giving it room to recover instead of amplifying the outage.",
  tags: ['reliability', 'patterns'],
  section: 'reliability',
  body,
  format: 'nugget',
};
