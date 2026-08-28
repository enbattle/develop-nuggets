import body from './session-vs-token-auth.md?raw';
import type { Nugget } from '@/types';

export const sessionVsTokenAuth: Nugget = {
  id: 'session-vs-token-auth',
  title: 'Session vs. Token Authentication',
  summary:
    'Server-side session plus cookie vs. stateless signed token — what each costs you in revocation, scale, and CSRF exposure.',
  tags: ['auth', 'apis', 'web', 'security'],
  section: 'security-auth',
  body,
  format: 'nugget',
};
