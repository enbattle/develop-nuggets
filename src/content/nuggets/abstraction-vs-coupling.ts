import body from './abstraction-vs-coupling.md?raw';
import type { Nugget } from '@/types';

export const abstractionVsCoupling: Nugget = {
  id: 'abstraction-vs-coupling',
  title: 'Abstraction vs. Coupling',
  summary:
    'Why adding an abstraction can tie two pieces of code more tightly together, and how to tell a load-bearing seam from a leaky one.',
  tags: ['patterns'],
  section: 'foundations',
  body,
  format: 'nugget',
};
