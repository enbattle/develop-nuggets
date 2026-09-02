import body from './guardrails.md?raw';
import type { Nugget } from '@/types';

export const guardrails: Nugget = {
  id: 'guardrails',
  title: 'Guardrails',
  summary:
    'Where runtime input/output guardrails sit in a production AI system and the design principles behind them — with the Safety track for framework detail.',
  tags: ['ai', 'mlops', 'guardrails', 'reliability'],
  section: 'ai-mlops',
  body,
  format: 'guide',
};
