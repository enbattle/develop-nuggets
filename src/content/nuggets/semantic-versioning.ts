import body from './semantic-versioning.md?raw';
import type { Nugget } from '@/types';

export const semanticVersioning: Nugget = {
  id: 'semantic-versioning',
  title: 'Semantic Versioning',
  summary:
    'What MAJOR.MINOR.PATCH promises a consumer, and the discipline required for those promises to mean anything.',
  tags: ['apis', 'patterns'],
  section: 'apis-communication',
  body,
  format: 'nugget',
};
