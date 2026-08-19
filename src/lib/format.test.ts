import { describe, it, expect } from 'vitest';
import { FORMAT_LABELS } from './format';

describe('FORMAT_LABELS', () => {
  it('has a display label for every content format', () => {
    expect(FORMAT_LABELS.nugget).toBe('Nugget');
    expect(FORMAT_LABELS.guide).toBe('Guide');
  });
});
