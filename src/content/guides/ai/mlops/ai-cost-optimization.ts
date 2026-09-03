import body from './ai-cost-optimization.md?raw';
import type { Nugget } from '@/types';

export const aiCostOptimization: Nugget = {
  id: 'ai-cost-optimization',
  title: 'AI Cost Optimization',
  summary:
    'Cutting LLM API spend without losing quality — model right-sizing, prompt and semantic caching, output-token control, and the Batch API.',
  tags: ['ai', 'mlops', 'performance'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
