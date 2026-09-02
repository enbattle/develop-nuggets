import body from './tree-of-thoughts.md?raw';
import type { Nugget } from '@/types';

export const treeOfThoughts: Nugget = {
  id: 'tree-of-thoughts',
  title: 'Tree of Thoughts & Search-Based Reasoning',
  summary:
    'Letting a model branch, evaluate, and backtrack across reasoning paths instead of one linear chain — BFS/DFS/MCTS search, a cheap approximation, and its steep cost.',
  tags: ['ai', 'prompting', 'patterns'],
  section: 'ai-reasoning',
  body,
  format: 'guide',
};
