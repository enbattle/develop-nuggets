import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { NUGGETS } from '@/content/nuggets';
import { GUIDES } from '@/content/guides';

function titlesOf(links: HTMLElement[]) {
  return links.map((link) => link.textContent);
}

function sortedTitles(items: { title: string }[]) {
  return items.map((item) => item.title).sort((a, b) => a.localeCompare(b));
}

describe('Sidebar', () => {
  it('lists guides, then nuggets, each alphabetically by title', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    const guidesGroup = screen.getByRole('heading', { name: 'Guides' })
      .closest('div')!;
    expect(titlesOf(within(guidesGroup).getAllByRole('link'))).toEqual(
      sortedTitles(GUIDES),
    );

    const nuggetsGroup = screen.getByRole('heading', { name: 'Nuggets' })
      .closest('div')!;
    expect(titlesOf(within(nuggetsGroup).getAllByRole('link'))).toEqual(
      sortedTitles(NUGGETS),
    );
  });

  it('marks the current nugget as active', () => {
    render(
      <MemoryRouter initialEntries={['/nuggets/idempotency']}>
        <Sidebar />
      </MemoryRouter>,
    );

    expect(screen.getByRole('link', { name: 'Idempotency' })).toHaveAttribute(
      'aria-current',
      'page',
    );
    expect(
      screen.getByRole('link', { name: 'Circuit Breaker' }),
    ).not.toHaveAttribute('aria-current');
  });

  it('calls onNavigate when a link is clicked', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <MemoryRouter>
        <Sidebar onNavigate={onNavigate} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('link', { name: 'Idempotency' }));

    expect(onNavigate).toHaveBeenCalled();
  });

  it('collapses and re-expands a group when its heading is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    const guidesToggle = screen.getByRole('button', { name: 'Guides' });
    expect(guidesToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Idempotency' })).toBeInTheDocument();

    await user.click(guidesToggle);

    expect(guidesToggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('link', { name: 'Redis' })).not.toBeInTheDocument();
    // Collapsing Guides doesn't touch the independent Nuggets group.
    expect(screen.getByRole('link', { name: 'Idempotency' })).toBeInTheDocument();

    await user.click(guidesToggle);

    expect(guidesToggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('link', { name: 'Redis' })).toBeInTheDocument();
  });
});
