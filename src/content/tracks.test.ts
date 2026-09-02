import { describe, it, expect } from 'vitest';
import { TRACKS, getTrack, trackForItem, type TrackSection } from './tracks';
import { getContent, trackNeighbors } from './index';

const SECTIONS: TrackSection[] = [
  'ai-llm-internals',
  'ai-reasoning',
  'ai-retrieval',
  'ai-agents',
  'ai-orchestration',
  'ai-safety',
  'ai-evaluation',
];

describe('TRACKS', () => {
  it('seeds the nine merge tracks', () => {
    expect(TRACKS).toHaveLength(9);
    expect(TRACKS.map((track) => track.id)).toEqual([
      'llm-internals',
      'reasoning',
      'model-adaptation',
      'rag',
      'agents',
      'orchestration',
      'safety-guardrails',
      'evaluation',
      'mlops',
    ]);
  });

  it('gives every track a unique id, a known section, and a one-sentence summary', () => {
    const ids = new Set(TRACKS.map((track) => track.id));
    expect(ids.size).toBe(TRACKS.length);

    for (const track of TRACKS) {
      expect(SECTIONS).toContain(track.section);
      expect(track.title.trim()).not.toBe('');
      expect(track.summary.trim()).not.toBe('');
      // one sentence: no internal sentence break
      expect(track.summary).not.toMatch(/\.\s+[A-Z]/);
    }
  });

  it('files reasoning + model-adaptation and evaluation + mlops as separate tracks sharing a section', () => {
    expect(getTrack('reasoning')?.section).toBe('ai-reasoning');
    expect(getTrack('model-adaptation')?.section).toBe('ai-reasoning');
    expect(getTrack('evaluation')?.section).toBe('ai-evaluation');
    expect(getTrack('mlops')?.section).toBe('ai-evaluation');
  });
});

describe('getTrack', () => {
  it('resolves a known track id', () => {
    expect(getTrack('rag')?.title).toBe('Retrieval-Augmented Generation');
  });

  it('returns undefined for an unknown id', () => {
    expect(getTrack('nope')).toBeUndefined();
  });
});

describe('trackForItem', () => {
  it('returns undefined when no track lists the id', () => {
    expect(trackForItem('idempotency')).toBeUndefined();
    expect(trackForItem('does-not-exist')).toBeUndefined();
  });

  it('agrees with getTrack for any id a track does list', () => {
    for (const track of TRACKS) {
      for (const itemId of track.items) {
        expect(trackForItem(itemId)?.id).toBe(track.id);
      }
    }
  });
});

describe('trackNeighbors', () => {
  it('returns no neighbours for an item that is not in any track', () => {
    const item = getContent('idempotency');
    expect(item).toBeDefined();
    expect(trackNeighbors(item!)).toEqual({ prev: null, next: null });
  });
});
