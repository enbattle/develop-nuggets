import body from './large-file-uploads.md?raw';
import type { Nugget } from '@/types';

export const largeFileUploads: Nugget = {
  id: 'large-file-uploads',
  title: 'Handling Large File Uploads',
  summary:
    "Handling uploads that don't fit in one request: presigned URLs, multipart, chunking, and resumability.",
  tags: ['apis', 'performance', 'patterns'],
  section: 'apis-communication',
  body,
  format: 'nugget',
};
