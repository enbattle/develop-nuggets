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
  it('renders a known nugget with its section eyebrow and tags', () => {
    renderAt('/nuggets/expand-contract');

    const heading = screen.getByRole('heading', {
      name: 'Expand-Contract Pattern',
    });
    expect(heading).toBeInTheDocument();
    const header = heading.closest('header')!;
    expect(within(header).getByText('Delivery & Tooling')).toBeInTheDocument();
    expect(within(header).getByText('patterns')).toBeInTheDocument();
  });

  it('shows a not-found message for an unknown id', () => {
    renderAt('/nuggets/does-not-exist');

    expect(screen.getByText('Content not found.')).toBeInTheDocument();
  });

  it('lists related nuggets by shared tags', () => {
    renderAt('/nuggets/idempotency');

    const relatedList = screen
      .getByRole('heading', { name: 'Related' })
      .closest('footer')!;
    expect(
      within(relatedList).getByRole('link', {
        name: /exponential backoff & jitter/i,
      }),
    ).toBeInTheDocument();
  });

  it('offers prev/next navigation within the same section', () => {
    renderAt('/nuggets/idempotency');

    // Reliability & Resilience, alphabetical: … Exponential Backoff & Jitter,
    // Idempotency, Observability, …
    const pager = screen.getByRole('navigation', {
      name: /more in reliability & resilience/i,
    });
    expect(
      within(pager).getByRole('link', {
        name: /exponential backoff & jitter/i,
      }),
    ).toHaveAttribute('href', '/nuggets/exponential-backoff');
    expect(
      within(pager).getByRole('link', { name: /observability/i }),
    ).toHaveAttribute('href', '/nuggets/observability');
  });
});
