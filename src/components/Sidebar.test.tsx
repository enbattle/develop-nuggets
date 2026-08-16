import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { NUGGETS } from '@/content/nuggets';

describe('Sidebar', () => {
  it('lists every nugget alphabetically by title', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>,
    );

    const links = screen.getAllByRole('link').map((link) => link.textContent);
    const expected = [...NUGGETS]
      .map((n) => n.title)
      .sort((a, b) => a.localeCompare(b));

    expect(links).toEqual(expected);
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
});
