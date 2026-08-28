import body from './oauth.md?raw';
import type { Nugget } from '@/types';

export const oauth: Nugget = {
  id: 'oauth',
  title: 'OAuth 2.0 & OpenID Connect',
  summary:
    'Delegated authorization — how a third-party app gets scoped, revocable access to your data without your password — plus what OIDC adds for login.',
  tags: ['auth', 'apis', 'security'],
  section: 'security-auth',
  body,
  format: 'guide',
};
