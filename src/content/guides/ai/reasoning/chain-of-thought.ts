import body from './chain-of-thought.md?raw';
import type { Nugget } from '@/types';

export const chainOfThought: Nugget = {
  id: 'chain-of-thought',
  title: 'Chain-of-Thought Prompting',
  summary:
    'Making a model show its work to raise accuracy on multi-step problems — zero- versus few-shot CoT, XML-structured reasoning, self-consistency voting, and where it adds noise.',
  tags: ['ai', 'prompting'],
  section: 'ai-reasoning',
  body,
  format: 'guide',
};
