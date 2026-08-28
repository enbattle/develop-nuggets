import body from './elasticsearch.md?raw';
import type { Nugget } from '@/types';

export const elasticsearch: Nugget = {
  id: 'elasticsearch',
  title: 'Elasticsearch',
  summary:
    'The inverted index behind full-text search, plus how Elasticsearch handles relevance, aggregations, and its operational gotchas.',
  tags: ['databases', 'tooling'],
  section: 'data-stores',
  body,
  format: 'guide',
};
