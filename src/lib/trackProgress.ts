/**
 * Per-item track completion, backed by `safeStorage` (never throws — degrades
 * to "nothing is complete" when localStorage is unavailable). This is reading
 * *state*, not content: it records which track items the reader has ticked
 * off and which track they last touched, nothing about the items themselves.
 *
 * Storage:
 *   dn:track-progress        → { [contentId]: true } completion map
 *   dn:track-progress:last   → the id of the last track the reader engaged
 */
import { useCallback, useSyncExternalStore } from 'react';
import type { Track } from '@/content/tracks';
import { trackForItem } from '@/content/tracks';
import { safeStorage } from './safeStorage';

const COMPLETION_KEY = 'dn:track-progress';
const LAST_TRACK_KEY = 'dn:track-progress:last';

type CompletionMap = Record<string, true>;

const listeners = new Set<() => void>();

function emit(): void {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// `useSyncExternalStore` needs a snapshot that's referentially stable while
// the underlying data is unchanged. localStorage hands back a string, so we
// cache the parsed object keyed by that raw string and only re-parse when it
// differs — which also keeps us honest across a `localStorage.clear()`.
let lastRaw: string | null = null;
let snapshot: CompletionMap = {};

function getSnapshot(): CompletionMap {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(COMPLETION_KEY);
  } catch {
    raw = null;
  }
  if (raw === lastRaw) return snapshot;
  lastRaw = raw;
  try {
    snapshot = raw ? (JSON.parse(raw) as CompletionMap) : {};
  } catch {
    snapshot = {};
  }
  return snapshot;
}

export const trackProgress = {
  isComplete(contentId: string): boolean {
    return getSnapshot()[contentId] === true;
  },

  markComplete(contentId: string): void {
    const next: CompletionMap = { ...getSnapshot(), [contentId]: true };
    safeStorage.set(COMPLETION_KEY, next);
    const track = trackForItem(contentId);
    if (track) safeStorage.set(LAST_TRACK_KEY, track.id);
    emit();
  },

  clearComplete(contentId: string): void {
    const current = getSnapshot();
    if (!(contentId in current)) return;
    const next = { ...current };
    delete next[contentId];
    safeStorage.set(COMPLETION_KEY, next);
    emit();
  },

  /** `done` = completed items, `total` = every item the track lists. */
  trackCompletion(track: Track): { done: number; total: number } {
    const map = getSnapshot();
    return {
      done: track.items.filter((id) => map[id] === true).length,
      total: track.items.length,
    };
  },

  /**
   * The first item in the track's reading order the reader hasn't ticked
   * off yet, or `undefined` when the whole track is complete. Pure — it
   * doesn't check whether the id resolves to real content.
   */
  nextIncomplete(track: Track): string | undefined {
    const map = getSnapshot();
    return track.items.find((id) => map[id] !== true);
  },

  /**
   * True when `id` is the *only* item in `track` still outstanding — i.e.
   * marking it complete finishes the track. False if `id` is already
   * complete, or if any other item is also outstanding.
   */
  isLastIncomplete(track: Track, id: string): boolean {
    const map = getSnapshot();
    if (map[id] === true) return false;
    return track.items.every((itemId) => itemId === id || map[itemId] === true);
  },

  getLastTrackId(): string | undefined {
    return safeStorage.get<string | undefined>(LAST_TRACK_KEY, undefined);
  },

  setLastTrackId(trackId: string): void {
    safeStorage.set(LAST_TRACK_KEY, trackId);
    emit();
  },
};

interface TrackProgressApi {
  isComplete: (contentId: string) => boolean;
  markComplete: (contentId: string) => void;
  clearComplete: (contentId: string) => void;
  trackCompletion: (track: Track) => { done: number; total: number };
  nextIncomplete: (track: Track) => string | undefined;
  isLastIncomplete: (track: Track, id: string) => boolean;
}

/** Reactive view of {@link trackProgress} — re-renders on any completion change. */
export function useTrackProgress(): TrackProgressApi {
  const map = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  const isComplete = useCallback(
    (contentId: string) => map[contentId] === true,
    [map],
  );
  const trackCompletion = useCallback(
    (track: Track) => ({
      done: track.items.filter((id) => map[id] === true).length,
      total: track.items.length,
    }),
    [map],
  );
  const nextIncomplete = useCallback(
    (track: Track) => track.items.find((id) => map[id] !== true),
    [map],
  );
  const isLastIncomplete = useCallback(
    (track: Track, id: string) =>
      map[id] !== true &&
      track.items.every((itemId) => itemId === id || map[itemId] === true),
    [map],
  );
  const markComplete = useCallback(
    (contentId: string) => trackProgress.markComplete(contentId),
    [],
  );
  const clearComplete = useCallback(
    (contentId: string) => trackProgress.clearComplete(contentId),
    [],
  );

  return {
    isComplete,
    markComplete,
    clearComplete,
    trackCompletion,
    nextIncomplete,
    isLastIncomplete,
  };
}
