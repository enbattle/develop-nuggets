import type { Nugget } from '@/types';
import { getContent } from '@/content';

/**
 * The hand-picked "Start here" set — the high-value minority (Pareto) a new
 * reader should hit first, spanning both domains. Ids only, resolved through
 * `getContent`; an id that no longer resolves is silently skipped (a test
 * keeps the list honest). Not a `format` and not a `Section` — just an
 * ordered pick list, same idea as a `Track` but flat and cross-domain.
 */
export const CURATED: string[] = [
  'cap-theorem',
  'idempotency',
  'expand-contract',
  'circuit-breaker',
  'inference',
  'what-is-rag',
  'what-is-agentic-ai',
  'prompt-injection',
];

/** `CURATED` resolved to content items, dropping any id that doesn't resolve. */
export function curatedItems(): Nugget[] {
  return CURATED.map((id) => getContent(id)).filter(
    (item): item is Nugget => item !== undefined,
  );
}
