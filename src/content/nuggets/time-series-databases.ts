import body from './time-series-databases.md?raw';
import type { Nugget } from '@/types';

export const timeSeriesDatabases: Nugget = {
  id: 'time-series-databases',
  title: 'Time Series Databases',
  summary:
    "Why append-mostly, timestamp-keyed workloads (metrics, sensors) get their own database, and what it optimizes that a relational one won't.",
  tags: ['databases', 'performance'],
  section: 'data-stores',
  body,
  format: 'nugget',
};
