import body from './cap-theorem.md?raw';
import type { Nugget } from '@/types';

export const capTheorem: Nugget = {
  id: 'cap-theorem',
  title: 'CAP Theorem',
  summary:
    "Why a distributed system can't keep both consistency and availability during a network partition, and what 'choosing' means in practice.",
  tags: ['patterns', 'reliability'],
  section: 'foundations',
  body,
  format: 'nugget',
};
