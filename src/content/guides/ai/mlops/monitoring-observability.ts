import body from './monitoring-observability.md?raw';
import type { Nugget } from '@/types';

export const monitoringObservability: Nugget = {
  id: 'monitoring-observability',
  title: 'Monitoring & Observability',
  summary:
    'What to watch once an AI system is live — latency and error rate alongside faithfulness and satisfaction — plus alerting, tracing, and feedback capture.',
  tags: ['ai', 'mlops', 'reliability'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
