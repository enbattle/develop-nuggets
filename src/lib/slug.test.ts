import { describe, expect, it } from 'vitest';
import { dedupe, extractHeadings, slugify } from './slug';

describe('slugify', () => {
  it('lowercases, trims, and hyphenates', () => {
    expect(slugify('  The Two Phases  ')).toBe('the-two-phases');
  });

  it('drops punctuation but keeps word characters and existing hyphens', () => {
    expect(slugify('RAG vs. Alternatives?')).toBe('rag-vs-alternatives');
    expect(slugify('LoRA / QLoRA')).toBe('lora-qlora');
    expect(slugify('time-to-first-token (TTFT)')).toBe('time-to-first-token-ttft');
  });

  it('collapses repeated separators and strips leading/trailing hyphens', () => {
    expect(slugify('--Prefill   &   Decode--')).toBe('prefill-decode');
  });
});

describe('dedupe', () => {
  it('returns the base first, then numbered suffixes', () => {
    const seen = new Map<string, number>();
    expect(dedupe('overview', seen)).toBe('overview');
    expect(dedupe('overview', seen)).toBe('overview-2');
    expect(dedupe('overview', seen)).toBe('overview-3');
    expect(dedupe('other', seen)).toBe('other');
  });
});

describe('extractHeadings', () => {
  it('pulls h2 and h3 with matching slugs, ignoring h1 and h4', () => {
    const md = [
      '# Title',
      '## First Section',
      'body',
      '### A Detail',
      '#### too deep',
      '## Second Section',
    ].join('\n');

    expect(extractHeadings(md)).toEqual([
      { depth: 2, text: 'First Section', id: 'first-section' },
      { depth: 3, text: 'A Detail', id: 'a-detail' },
      { depth: 2, text: 'Second Section', id: 'second-section' },
    ]);
  });

  it('skips headings inside fenced code blocks', () => {
    const md = ['## Real', '```', '## Not A Heading', '```', '## Also Real'].join(
      '\n',
    );
    expect(extractHeadings(md).map((h) => h.text)).toEqual(['Real', 'Also Real']);
  });

  it('dedupes repeated heading text the way the renderer does', () => {
    const md = ['## Setup', '## Setup', '## Setup'].join('\n');
    expect(extractHeadings(md).map((h) => h.id)).toEqual([
      'setup',
      'setup-2',
      'setup-3',
    ]);
  });

  it('strips trailing ATX hashes', () => {
    expect(extractHeadings('## Closed heading ##')).toEqual([
      { depth: 2, text: 'Closed heading', id: 'closed-heading' },
    ]);
  });
});
