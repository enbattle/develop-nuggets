import body from './contextual-compression.md?raw';
import type { Nugget } from '@/types';

export const contextualCompression: Nugget = {
  id: 'contextual-compression',
  title: 'Contextual Compression',
  summary:
    'Trimming each retrieved chunk down to the part that answers the query before it reaches the generator, cutting noise and token cost.',
  tags: ['rag', 'performance', 'patterns'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
