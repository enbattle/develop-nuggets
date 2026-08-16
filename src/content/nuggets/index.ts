import type { Nugget } from '@/types';
import { expandContract } from './expand-contract';
import { idempotency } from './idempotency';
import { exponentialBackoff } from './exponential-backoff';
import { outboxPattern } from './outbox-pattern';
import { nPlusOneQueries } from './n-plus-one-queries';
import { circuitBreaker } from './circuit-breaker';

/** Add a new nugget's import here — see CLAUDE.md "Adding a nugget". */
export const NUGGETS: Nugget[] = [
  expandContract,
  idempotency,
  exponentialBackoff,
  outboxPattern,
  nPlusOneQueries,
  circuitBreaker,
];

export function getNugget(id: string): Nugget | undefined {
  return NUGGETS.find((nugget) => nugget.id === id);
}
