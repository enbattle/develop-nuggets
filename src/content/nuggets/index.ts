import type { Nugget } from '@/types';
import { expandContract } from './expand-contract';
import { idempotency } from './idempotency';
import { exponentialBackoff } from './exponential-backoff';
import { outboxPattern } from './outbox-pattern';
import { nPlusOneQueries } from './n-plus-one-queries';
import { circuitBreaker } from './circuit-breaker';
import { capTheorem } from './cap-theorem';
import { cacheInvalidation } from './cache-invalidation';
import { rateLimiting } from './rate-limiting';
import { databaseIndexing } from './database-indexing';
import { testingPyramid } from './testing-pyramid';
import { sqlInjection } from './sql-injection';
import { semanticVersioning } from './semantic-versioning';
import { gitRebaseVsMerge } from './git-rebase-vs-merge';
import { consistentHashing } from './consistent-hashing';
import { observability } from './observability';

/** Add a new nugget's import here — see CLAUDE.md "Adding a nugget". */
export const NUGGETS: Nugget[] = [
  expandContract,
  idempotency,
  exponentialBackoff,
  outboxPattern,
  nPlusOneQueries,
  circuitBreaker,
  capTheorem,
  cacheInvalidation,
  rateLimiting,
  databaseIndexing,
  testingPyramid,
  sqlInjection,
  semanticVersioning,
  gitRebaseVsMerge,
  consistentHashing,
  observability,
];

export function getNugget(id: string): Nugget | undefined {
  return NUGGETS.find((nugget) => nugget.id === id);
}
