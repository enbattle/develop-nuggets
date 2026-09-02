import { describe, it, expect } from 'vitest';
import {
  SECTION_LABELS,
  SECTION_DESCRIPTIONS,
  SECTION_ORDER,
  DOMAIN_LABELS,
  DOMAIN_ORDER,
  sectionDomain,
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

  it('keeps all ten systems sections ahead of the AI sections', () => {
    const firstAi = SECTION_ORDER.findIndex((s) => sectionDomain(s) === 'ai');
    expect(firstAi).toBe(10);
    expect(SECTION_ORDER.slice(firstAi).every((s) => s.startsWith('ai-'))).toBe(
      true,
    );
  });
});

describe('domains', () => {
  it('orders the two domains systems-first', () => {
    expect(DOMAIN_ORDER).toEqual(['systems', 'ai']);
    expect(new Set(DOMAIN_ORDER).size).toBe(DOMAIN_ORDER.length);
  });

  it('has a non-empty label for every domain', () => {
    for (const domain of DOMAIN_ORDER) {
      expect(DOMAIN_LABELS[domain]?.trim()).toBeTruthy();
    }
  });

  it('maps `ai-` sections to the ai domain and everything else to systems', () => {
    for (const section of SECTION_ORDER) {
      const expected = section.startsWith('ai-') ? 'ai' : 'systems';
      expect(sectionDomain(section)).toBe(expected);
    }
  });

  it('resolves every section to a domain in DOMAIN_ORDER', () => {
    for (const section of SECTION_ORDER) {
      expect(DOMAIN_ORDER).toContain(sectionDomain(section));
    }
  });
});
