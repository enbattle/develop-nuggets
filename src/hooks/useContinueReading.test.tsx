import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { trackProgress } from '@/lib/trackProgress';
import { getTrack } from '@/content/tracks';
import { useResumeTrack } from './useContinueReading';

afterEach(() => {
  window.localStorage.clear();
});

describe('useResumeTrack', () => {
  it('is null when no track has been engaged', () => {
    const { result } = renderHook(() => useResumeTrack());
    expect(result.current).toBeNull();
  });

  it('returns the first incomplete item of the last-engaged track', () => {
    trackProgress.setLastTrackId('rag');
    const { result } = renderHook(() => useResumeTrack());
    expect(result.current?.id).toBe('what-is-rag');
  });

  it('is null once every resolvable item in the last track is complete', () => {
    trackProgress.setLastTrackId('rag');
    for (const id of getTrack('rag')!.items) trackProgress.markComplete(id);
    const { result } = renderHook(() => useResumeTrack());
    expect(result.current).toBeNull();
  });

  it('is null for an unknown last-track id', () => {
    trackProgress.setLastTrackId('not-a-track');
    const { result } = renderHook(() => useResumeTrack());
    expect(result.current).toBeNull();
  });
});
