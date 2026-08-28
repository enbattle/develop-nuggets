import body from './docker-getting-started.md?raw';
import type { Nugget } from '@/types';

export const dockerGettingStarted: Nugget = {
  id: 'docker-getting-started',
  title: 'Docker: Getting Started',
  summary:
    'Containers from first principles: images, layers, the Dockerfile, and the handful of commands you need on day one.',
  tags: ['tooling'],
  section: 'delivery',
  body,
  format: 'guide',
};
