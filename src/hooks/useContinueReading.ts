import { useEffect } from 'react';
import type { Nugget } from '@/types';
import { readingProgress } from '@/lib/readingProgress';
import { getContent } from '@/content';
import { getTrack } from '@/content/tracks';
import { trackProgress, useTrackProgress } from '@/lib/trackProgress';

/** Restores scroll position for a nugget on mount and persists it (+ last-viewed id) as the user scrolls. */
export function useRecordReadingProgress(id: string | undefined): void {
  useEffect(() => {
    if (!id) return;

    readingProgress.setLastViewedId(id);
    window.scrollTo({ top: readingProgress.getScrollY(id) });

    let frame: number | null = null;
    const onScroll = () => {
      if (frame !== null) return;
      frame = requestAnimationFrame(() => {
        readingProgress.setScrollY(id, window.scrollY);
        frame = null;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, [id]);
}

export function useLastViewedNugget(nuggets: Nugget[]): Nugget | undefined {
  const lastViewedId = readingProgress.getLastViewedId();
  return lastViewedId ? nuggets.find((n) => n.id === lastViewedId) : undefined;
}

/**
 * The next item to read in the track the reader last engaged with — the
 * first of its `items` that resolves and isn't marked complete — or `null`
 * if there's no such track or every resolvable item is done. Feeds a
 * "Resume track" affordance; reactive to completion changes.
 */
export function useResumeTrack(): Nugget | null {
  const { isComplete } = useTrackProgress();
  const lastTrackId = trackProgress.getLastTrackId();
  const track = lastTrackId ? getTrack(lastTrackId) : undefined;
  if (!track) return null;

  for (const id of track.items) {
    const item = getContent(id);
    if (item && !isComplete(id)) return item;
  }
  return null;
}
