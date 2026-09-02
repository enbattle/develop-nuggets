import { describe, it, expect, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { Track } from '@/content/tracks';
import { trackProgress, useTrackProgress } from './trackProgress';

const track: Track = {
  id: 'demo',
  title: 'Demo',
  summary: 'A demo track.',
  section: 'ai-retrieval',
  items: ['a', 'b', 'c'],
};

afterEach(() => {
  window.localStorage.clear();
});

describe('trackProgress', () => {
  it('round-trips per-item completion through localStorage', () => {
    expect(trackProgress.isComplete('a')).toBe(false);

    trackProgress.markComplete('a');
    expect(trackProgress.isComplete('a')).toBe(true);
    expect(window.localStorage.getItem('dn:track-progress')).toBe('{"a":true}');

    trackProgress.clearComplete('a');
    expect(trackProgress.isComplete('a')).toBe(false);
  });

  it('is idempotent and does not touch unrelated keys', () => {
    trackProgress.markComplete('a');
    trackProgress.markComplete('a');
    trackProgress.clearComplete('b'); // never set — no-op
    expect(trackProgress.trackCompletion(track)).toEqual({ done: 1, total: 3 });
  });

  it('counts completion against every item the track lists', () => {
    expect(trackProgress.trackCompletion(track)).toEqual({ done: 0, total: 3 });
    trackProgress.markComplete('a');
    trackProgress.markComplete('c');
    expect(trackProgress.trackCompletion(track)).toEqual({ done: 2, total: 3 });
  });

  it('remembers the last track id independently of completion', () => {
    expect(trackProgress.getLastTrackId()).toBeUndefined();
    trackProgress.setLastTrackId('rag');
    expect(trackProgress.getLastTrackId()).toBe('rag');
  });

  it('degrades to "nothing complete" when localStorage is unreadable', () => {
    const original = Object.getOwnPropertyDescriptor(window, 'localStorage');
    Object.defineProperty(window, 'localStorage', {
      configurable: true,
      get() {
        throw new Error('blocked');
      },
    });

    expect(() => trackProgress.markComplete('a')).not.toThrow();
    expect(trackProgress.isComplete('a')).toBe(false);
    expect(trackProgress.trackCompletion(track)).toEqual({ done: 0, total: 3 });

    if (original) Object.defineProperty(window, 'localStorage', original);
  });
});

describe('useTrackProgress', () => {
  it('re-renders when completion changes', () => {
    const { result } = renderHook(() => useTrackProgress());

    expect(result.current.isComplete('a')).toBe(false);

    act(() => result.current.markComplete('a'));
    expect(result.current.isComplete('a')).toBe(true);
    expect(result.current.trackCompletion(track)).toEqual({
      done: 1,
      total: 3,
    });

    act(() => result.current.clearComplete('a'));
    expect(result.current.isComplete('a')).toBe(false);
  });
});
