import { describe, it, expect } from 'vitest';
import {
  SECTION_LABELS,
  SECTION_DESCRIPTIONS,
  SECTION_ORDER,
} from './sections';

describe('sections metadata', () => {
  it('lists every section exactly once in SECTION_ORDER', () => {
    const labelKeys = Object.keys(SECTION_LABELS).sort();
    expect([...SECTION_ORDER].sort()).toEqual(labelKeys);
    expect(new Set(SECTION_ORDER).size).toBe(SECTION_ORDER.length);
  });

  it('has a non-empty label and charter for every section', () => {
    for (const section of SECTION_ORDER) {
      expect(SECTION_LABELS[section]?.trim()).toBeTruthy();
      expect(SECTION_DESCRIPTIONS[section]?.trim()).toBeTruthy();
    }
  });
});
