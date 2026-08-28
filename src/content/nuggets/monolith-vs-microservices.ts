import body from './monolith-vs-microservices.md?raw';
import type { Nugget } from '@/types';

export const monolithVsMicroservices: Nugget = {
  id: 'monolith-vs-microservices',
  title: 'Monolith vs. Microservices',
  summary:
    "The real tradeoffs behind the split — deployment, team autonomy, failure modes — and why 'microservices' isn't a maturity level.",
  tags: ['patterns', 'reliability'],
  section: 'foundations',
  body,
  format: 'nugget',
};
