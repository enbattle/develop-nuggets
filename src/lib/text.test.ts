import { describe, it, expect } from 'vitest';
import { excerpt } from './text';

describe('excerpt', () => {
  it('strips fenced code blocks entirely', () => {
    const markdown = 'Before.\n\n```ts\nconst x = 1;\n```\n\nAfter.';
    expect(excerpt(markdown)).toBe('Before. After.');
  });

  it('unwraps inline code, links, and headings', () => {
    const markdown =
      '## Heading\nUse `foo()` and see [the docs](https://example.com).';
    expect(excerpt(markdown)).toBe('Heading Use foo() and see the docs.');
  });

  it('truncates long text with an ellipsis', () => {
    const long = 'word '.repeat(50).trim();
    const result = excerpt(long, 20);
    expect(result.endsWith('…')).toBe(true);
    expect(result.length).toBeLessThanOrEqual(21);
  });

  it('leaves short text untouched', () => {
    expect(excerpt('Short and sweet.')).toBe('Short and sweet.');
  });
});
