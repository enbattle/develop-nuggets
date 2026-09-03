import { createRef } from 'react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { Header } from './Header';
import { PRIMARY_NAV } from '@/lib/nav';

function renderHeader(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <Header searchRef={createRef<HTMLInputElement>()} onToggleSidebar={() => {}} />
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('Header', () => {
  it('links the logo home and carries the primary nav', () => {
    renderHeader();

    expect(screen.getByRole('link', { name: /dev nuggets/i })).toHaveAttribute(
      'href',
      '/',
    );

    const nav = screen.getByRole('navigation', { name: 'Primary' });
    for (const item of PRIMARY_NAV) {
      expect(
        within(nav).getByRole('link', { name: item.label }),
      ).toHaveAttribute('href', item.to);
    }
  });

  it('marks the current section active', () => {
    renderHeader('/browse');
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    expect(within(nav).getByRole('link', { name: 'Browse' })).toHaveClass(
      'text-accent',
    );
    expect(within(nav).getByRole('link', { name: 'Tracks' })).not.toHaveClass(
      'text-accent',
    );
  });

  it('has one search box', () => {
    renderHeader();
    expect(screen.getAllByRole('searchbox')).toHaveLength(1);
  });
});
