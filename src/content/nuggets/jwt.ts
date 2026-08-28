import body from './jwt.md?raw';
import type { Nugget } from '@/types';

export const jwt: Nugget = {
  id: 'jwt',
  title: 'JSON Web Tokens (JWT)',
  summary:
    "A signed, self-contained token a server can verify without a database lookup — what that buys you, and the ways it's misused.",
  tags: ['auth', 'apis', 'security'],
  section: 'security-auth',
  body,
  format: 'nugget',
};
