import body from './saga-pattern.md?raw';
import type { Nugget } from '@/types';

export const sagaPattern: Nugget = {
  id: 'saga-pattern',
  title: 'Saga Pattern',
  summary:
    'Replacing a distributed transaction with a sequence of local steps, each with a compensating action to undo it if a later step fails.',
  tags: ['patterns', 'reliability', 'messaging'],
  section: 'messaging',
  body,
  format: 'nugget',
};
