import body from './reflexion-meta-prompting.md?raw';
import type { Nugget } from '@/types';

export const reflexionMetaPrompting: Nugget = {
  id: 'reflexion-meta-prompting',
  title: 'Reflexion & Meta-Prompting',
  summary:
    'Techniques where a model improves its own output — generate/critique/retry (Reflexion), planning its own approach (meta-prompting), and auto-optimizing prompts (APE).',
  tags: ['ai', 'prompting', 'agents'],
  section: 'ai-reasoning',
  body,
  format: 'guide',
};
