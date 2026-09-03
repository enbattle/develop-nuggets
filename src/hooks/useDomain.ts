import { useSyncExternalStore } from 'react';
import { safeStorage } from '@/lib/safeStorage';
import { DOMAIN_ORDER, type Domain } from '@/lib/sections';

/**
 * The active content domain (`systems` | `ai`), shared across the whole app:
 * the sidebar's domain switcher, the browse page's filter, and the home
 * hub's domain cards all read and write the same value, and every
 * `useDomain()` caller re-renders when it changes. Persisted per-browser via
 * `safeStorage` (key `dn:domain`); defaults to `systems`.
 *
 * A module-level store + `useSyncExternalStore` rather than context, so no
 * provider has to wrap the tree and non-React callers (e.g. a hub card's
 * click handler) can `setDomain` directly.
 */

const KEY = 'dn:domain';
const DEFAULT: Domain = 'systems';

function normalize(value: unknown): Domain {
  return DOMAIN_ORDER.includes(value as Domain) ? (value as Domain) : DEFAULT;
}

let current: Domain = normalize(safeStorage.get<Domain>(KEY, DEFAULT));
const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Domain {
  return current;
}

export function setDomain(next: Domain): void {
  const value = normalize(next);
  if (value === current) return;
  current = value;
  safeStorage.set(KEY, value);
  for (const listener of listeners) listener();
}

export function useDomain(): [Domain, (next: Domain) => void] {
  const domain = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return [domain, setDomain];
}

/** Test-only: reset the store to the default between cases. */
export function resetDomain(): void {
  setDomain(DEFAULT);
}
