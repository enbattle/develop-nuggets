import body from './change-data-capture.md?raw';
import type { Nugget } from '@/types';

export const changeDataCapture: Nugget = {
  id: 'change-data-capture',
  title: 'Change Data Capture',
  summary:
    'Streaming every row change out of your database as an event log, so downstream systems stay in sync without dual writes.',
  tags: ['databases', 'patterns', 'messaging'],
  section: 'messaging',
  body,
  format: 'nugget',
};
