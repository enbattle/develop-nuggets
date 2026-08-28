import body from './data-modeling.md?raw';
import type { Nugget } from '@/types';

export const dataModeling: Nugget = {
  id: 'data-modeling',
  title: 'Data Modeling',
  summary:
    "Turning domain requirements into tables or documents — normalization, relationships, and modeling for the queries you'll actually run.",
  tags: ['databases', 'patterns'],
  section: 'databases-modeling',
  body,
  format: 'guide',
};
