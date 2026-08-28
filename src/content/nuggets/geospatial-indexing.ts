import body from './geospatial-indexing.md?raw';
import type { Nugget } from '@/types';

export const geospatialIndexing: Nugget = {
  id: 'geospatial-indexing',
  title: 'Geospatial Indexing',
  summary:
    "The structures (geohash, R-tree, S2) that make 'find everything near this point' fast instead of a scan over every row.",
  tags: ['databases', 'performance', 'patterns'],
  section: 'databases-modeling',
  body,
  format: 'nugget',
};
