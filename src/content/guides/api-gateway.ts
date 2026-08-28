import body from './api-gateway.md?raw';
import type { Nugget } from '@/types';

export const apiGateway: Nugget = {
  id: 'api-gateway',
  title: 'APIs: Gateway',
  summary:
    'The single entry point that fronts your services — routing, auth, rate limiting, aggregation — and what belongs in it vs. behind it.',
  tags: ['apis', 'networking', 'tooling'],
  section: 'apis-communication',
  body,
  format: 'guide',
};
