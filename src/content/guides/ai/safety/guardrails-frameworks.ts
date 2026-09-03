import body from './guardrails-frameworks.md?raw';
import type { Nugget } from '@/types';

export const guardrailsFrameworks: Nugget = {
  id: 'guardrails-frameworks',
  title: 'Guardrails Frameworks',
  summary:
    'The build-versus-buy landscape for input/output guardrails — Guardrails AI, NeMo, Llama Guard, and a lightweight Claude-as-classifier alternative.',
  tags: ['ai', 'guardrails', 'security', 'tooling'],
  section: 'ai-safety',
  body,
  format: 'guide',
};
