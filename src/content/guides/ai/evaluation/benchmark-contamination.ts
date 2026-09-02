import body from './benchmark-contamination.md?raw';
import type { Nugget } from '@/types';

export const benchmarkContamination: Nugget = {
  id: 'benchmark-contamination',
  title: 'Benchmark Contamination',
  summary:
    'Why public benchmark scores drift upward as test sets leak into training data, how to detect it, and what to trust instead.',
  tags: ['ai', 'evals', 'testing'],
  section: 'ai-evaluation',
  body,
  format: 'guide',
};
