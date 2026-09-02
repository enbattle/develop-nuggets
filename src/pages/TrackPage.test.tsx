import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TrackPage } from './TrackPage';

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <Routes>
          <Route path="/tracks/:id" element={<TrackPage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('TrackPage', () => {
  it('renders a known track with its title, summary, and a progress bar', () => {
    renderAt('/tracks/rag');

    expect(
      screen.getByRole('heading', { name: 'Retrieval-Augmented Generation' }),
    ).toBeInTheDocument();
    expect(screen.getByText(/how rag works end to end/i)).toBeInTheDocument();

    const bar = screen.getByRole('progressbar', {
      name: /retrieval-augmented generation progress/i,
    });
    expect(bar).toHaveAttribute('aria-valuenow', '0');
  });

  it('shows the empty-items state while a track has no migrated content', () => {
    renderAt('/tracks/rag');
    expect(screen.getByText(/no items yet/i)).toBeInTheDocument();
    // Nothing to start yet, so no Start/Resume link.
    expect(
      screen.queryByRole('link', { name: /start|resume/i }),
    ).not.toBeInTheDocument();
  });

  it('shows a not-found card for an unknown track id', () => {
    renderAt('/tracks/bogus');
    expect(screen.getByText('Track not found.')).toBeInTheDocument();
  });
});
