import body from './xss.md?raw';
import type { Nugget } from '@/types';

export const xss: Nugget = {
  id: 'xss',
  title: 'Cross-Site Scripting (XSS)',
  summary:
    "How attacker-controlled input ends up running as JavaScript in another user's browser, and why context-aware output encoding is the fix.",
  tags: ['security', 'web'],
  section: 'security-auth',
  body,
  format: 'nugget',
};
