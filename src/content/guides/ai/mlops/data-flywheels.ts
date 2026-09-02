import body from './data-flywheels.md?raw';
import type { Nugget } from '@/types';

export const dataFlywheels: Nugget = {
  id: 'data-flywheels',
  title: 'Data Flywheels',
  summary:
    'Building the loop where product usage generates feedback that improves the model — feedback capture, preference datasets, and flywheel stages.',
  tags: ['ai', 'mlops', 'fine-tuning', 'process'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
