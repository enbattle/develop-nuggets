import body from './observability.md?raw';
import type { Nugget } from '@/types';

export const observability: Nugget = {
  id: 'observability',
  title: 'Observability: Metrics, Logs, and Traces',
  summary:
    "What metrics, logs, and traces each tell you that the others can't, and how they combine to answer 'why is it slow?'",
  tags: ['reliability'],
  section: 'reliability',
  body,
  format: 'nugget',
};
