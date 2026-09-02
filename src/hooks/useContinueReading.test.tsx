import { describe, it, expect, afterEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { trackProgress } from '@/lib/trackProgress';
import { useResumeTrack } from './useContinueReading';

afterEach(() => {
  window.localStorage.clear();
});

describe('useResumeTrack', () => {
  it('is null when no track has been engaged', () => {
    const { result } = renderHook(() => useResumeTrack());
    expect(result.current).toBeNull();
  });

  it('is null when the last track has no resolvable, incomplete item', () => {
    // Tracks seed with empty `items` until Phase 2 fills them.
    trackProgress.setLastTrackId('rag');
    const { result } = renderHook(() => useResumeTrack());
    expect(result.current).toBeNull();
  });

  it('is null for an unknown last-track id', () => {
    trackProgress.setLastTrackId('not-a-track');
    const { result } = renderHook(() => useResumeTrack());
    expect(result.current).toBeNull();
  });
});
