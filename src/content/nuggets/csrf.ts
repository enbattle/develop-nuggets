import body from './csrf.md?raw';
import type { Nugget } from '@/types';

export const csrf: Nugget = {
  id: 'csrf',
  title: 'Cross-Site Request Forgery (CSRF)',
  summary:
    'Why the browser attaching cookies to every request lets a malicious page act as a logged-in user, and how SameSite cookies and CSRF tokens stop it.',
  tags: ['security', 'web', 'auth'],
  section: 'security-auth',
  body,
  format: 'nugget',
};
