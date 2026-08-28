import body from './blob-storage.md?raw';
import type { Nugget } from '@/types';

export const blobStorage: Nugget = {
  id: 'blob-storage',
  title: 'Blob Storage',
  summary:
    'Object stores like S3 as the default home for files and large payloads — the model, the consistency guarantees, the access patterns.',
  tags: ['tooling', 'apis'],
  section: 'data-stores',
  body,
  format: 'guide',
};
