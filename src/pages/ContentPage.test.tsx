import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, within, fireEvent } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { getTrack } from '@/content/tracks';
import { ContentPage } from './ContentPage';

function seedComplete(ids: string[]) {
  window.localStorage.setItem(
    'dn:track-progress',
    JSON.stringify(Object.fromEntries(ids.map((id) => [id, true]))),
  );
}

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

  describe('inside a track', () => {
    it('shows the track progress strip with position and remaining count', () => {
      renderAt('/guides/what-is-rag');

      const strip = screen.getByRole('region', { name: /track progress/i });
      expect(
        within(strip).getByRole('link', {
          name: 'Retrieval-Augmented Generation',
        }),
      ).toHaveAttribute('href', '/tracks/rag');
      expect(within(strip).getByText('1 of 17')).toBeInTheDocument();
      // completion is tracked separately from position — nothing ticked yet
      expect(within(strip).getByText('17 left')).toBeInTheDocument();
      expect(
        within(strip).getByRole('progressbar', {
          name: /retrieval-augmented generation progress/i,
        }),
      ).toHaveAttribute('aria-valuenow', '0');
    });

    it('labels the pager as track navigation and links to the next item', () => {
      renderAt('/guides/what-is-rag');

      const pager = screen.getByRole('navigation', {
        name: /track: retrieval-augmented generation/i,
      });
      expect(within(pager).getByText(/next in track/i)).toBeInTheDocument();
      expect(
        within(pager).getByRole('link', { name: /the rag pipeline/i }),
      ).toHaveAttribute('href', '/guides/rag-pipeline');
    });

    it('shows a back-to-track link when the track item has no next', () => {
      renderAt('/guides/knowledge-architecture');

      const pager = screen.getByRole('navigation', {
        name: /track: retrieval-augmented generation/i,
      });
      expect(
        within(pager).getByRole('link', {
          name: /back to retrieval-augmented generation/i,
        }),
      ).toHaveAttribute('href', '/tracks/rag');
    });

    it('swaps the strip for a "Track complete" state on marking the last item', () => {
      const rag = getTrack('rag')!;
      seedComplete(rag.items.filter((id) => id !== 'knowledge-architecture'));
      renderAt('/guides/knowledge-architecture');

      const strip = screen.getByRole('region', { name: /track progress/i });
      expect(within(strip).getByText(/1 left/i)).toBeInTheDocument();

      const finishButton = screen.getByRole('button', {
        name: /finish track/i,
      });
      fireEvent.click(finishButton);

      expect(screen.getByText(/track complete/i)).toBeInTheDocument();
      expect(screen.queryByText(/1 left/i)).not.toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /back to track overview/i }),
      ).toHaveAttribute('href', '/tracks/rag');
    });
  });
});
