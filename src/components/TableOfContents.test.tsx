import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import type { Heading } from '@/lib/slug';
import { TableOfContents } from './TableOfContents';

const headings: Heading[] = [
  { depth: 2, text: 'Setup', id: 'setup' },
  { depth: 3, text: 'Install', id: 'install' },
  { depth: 2, text: 'Usage', id: 'usage' },
];

describe('TableOfContents', () => {
  it('renders an "On this page" nav linking to each heading anchor', () => {
    render(<TableOfContents headings={headings} />);

    const nav = screen.getByRole('navigation', { name: 'On this page' });
    expect(within(nav).getByRole('link', { name: 'Setup' })).toHaveAttribute(
      'href',
      '#setup',
    );
    expect(within(nav).getByRole('link', { name: 'Install' })).toHaveAttribute(
      'href',
      '#install',
    );
    expect(within(nav).getByRole('link', { name: 'Usage' })).toHaveAttribute(
      'href',
      '#usage',
    );
  });

  it('indents h3 entries under their h2', () => {
    render(<TableOfContents headings={headings} />);
    const install = screen.getByRole('link', { name: 'Install' });
    expect(install.closest('li')).toHaveClass('pl-3');
    expect(
      screen.getByRole('link', { name: 'Setup' }).closest('li'),
    ).not.toHaveClass('pl-3');
  });

  it('renders nothing when there are no headings', () => {
    const { container } = render(<TableOfContents headings={[]} />);
    expect(container).toBeEmptyDOMElement();
  });
});
