import body from './mlops-advanced-topics.md?raw';
import type { Nugget } from '@/types';

export const mlopsAdvancedTopics: Nugget = {
  id: 'mlops-advanced-topics',
  title: 'Feature Stores & Advanced Patterns',
  summary:
    'Patterns for AI systems at scale — feature stores, online learning, multi-region routing, chaos testing, and cost-anomaly detection.',
  tags: ['ai', 'mlops', 'reliability', 'performance'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
