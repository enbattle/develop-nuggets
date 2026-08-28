import body from './outbox-pattern.md?raw';
import type { Nugget } from '@/types';

export const outboxPattern: Nugget = {
  id: 'outbox-pattern',
  title: 'Outbox Pattern',
  summary:
    "Writing an event to a table in the same transaction as your data, so the publish and the DB write can't succeed independently.",
  tags: ['reliability', 'patterns', 'messaging'],
  section: 'messaging',
  body,
  format: 'nugget',
};
