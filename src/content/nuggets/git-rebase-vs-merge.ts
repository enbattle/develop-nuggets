import body from './git-rebase-vs-merge.md?raw';
import type { Nugget } from '@/types';

export const gitRebaseVsMerge: Nugget = {
  id: 'git-rebase-vs-merge',
  title: 'Git Rebase vs. Merge',
  summary:
    'What each actually does to history, which to use on a private branch vs. a shared one, and the golden rule for rebasing.',
  tags: ['git'],
  section: 'delivery',
  body,
  format: 'nugget',
};
