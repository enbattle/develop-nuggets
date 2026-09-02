import body from './prompt-caching.md?raw';
import type { Nugget } from '@/types';

export const promptCaching: Nugget = {
  id: 'prompt-caching',
  title: 'Prompt Caching',
  summary:
    "Anthropic's server-side prefix cache: how cache_control works, what a hit and a write cost, the 5-minute TTL, and how to order a prompt so the stable part gets reused.",
  tags: ['ai', 'inference', 'performance', 'prompting'],
  section: 'ai-llm-internals',
  body,
  format: 'guide',
};
