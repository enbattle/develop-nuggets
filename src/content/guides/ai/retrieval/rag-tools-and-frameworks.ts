import body from './rag-tools-and-frameworks.md?raw';
import type { Nugget } from '@/types';

export const ragToolsAndFrameworks: Nugget = {
  id: 'rag-tools-and-frameworks',
  title: 'RAG Tools & Frameworks',
  summary:
    'A tour of the vector databases, orchestration frameworks, and eval tools in the RAG ecosystem, and where each one fits.',
  tags: ['rag', 'tooling', 'embeddings'],
  section: 'ai-retrieval',
  body,
  format: 'guide',
};
