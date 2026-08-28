import body from './testing-pyramid.md?raw';
import type { Nugget } from '@/types';

export const testingPyramid: Nugget = {
  id: 'testing-pyramid',
  title: 'The Testing Pyramid',
  summary:
    'Why most of your tests should be fast unit tests and only a few slow end-to-end ones, and what an inverted pyramid costs.',
  tags: ['testing'],
  section: 'delivery',
  body,
  format: 'nugget',
};
