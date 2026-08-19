import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { ContentPage } from './ContentPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <Routes>
          <Route path="/nuggets/:id" element={<ContentPage />} />
          <Route path="/guides/:id" element={<ContentPage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('ContentPage', () => {
  it('renders a known nugget with its tags', () => {
    renderAt('/nuggets/expand-contract');

    const heading = screen.getByRole('heading', {
      name: 'Expand-Contract Pattern',
    });
    expect(heading).toBeInTheDocument();
    // Scoped to the header — the related-nuggets footer can also mention
    // "patterns" as part of another nugget's tag list.
    expect(
      within(heading.closest('header')!).getByText('patterns'),
    ).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown id', () => {
    renderAt('/nuggets/does-not-exist');

    expect(screen.getByText('Content not found.')).toBeInTheDocument();
  });

  it('lists related nuggets by shared tags', () => {
    renderAt('/nuggets/idempotency');

    expect(screen.getByText('Related')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /exponential backoff & jitter/i }),
    ).toBeInTheDocument();
  });
});
