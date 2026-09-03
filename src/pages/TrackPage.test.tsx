import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { getTrack } from '@/content/tracks';
import { TrackPage } from './TrackPage';

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

  it('lists the track items in order with a Start link', () => {
    renderAt('/tracks/rag');

    expect(
      screen.getByRole('link', { name: /what is rag\?/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /^start|^resume/i }),
    ).toBeInTheDocument();
  });

  it('shows a not-found card for an unknown track id', () => {
    renderAt('/tracks/bogus');
    expect(screen.getByText('Track not found.')).toBeInTheDocument();
  });

  it('shows an "N of M complete · X left" line under the progress bar', () => {
    renderAt('/tracks/rag');
    expect(screen.getByText(/0 of 17 complete/i)).toBeInTheDocument();
    expect(screen.getByText('17 left')).toBeInTheDocument();
  });

  it('points the Start link at the first incomplete resolvable item', () => {
    seedComplete(['what-is-rag']);
    renderAt('/tracks/rag');

    const resume = screen.getByRole('link', { name: /^resume/i });
    expect(resume).toHaveAttribute('href', '/guides/rag-pipeline');
  });

  it('rewards a finished track with a completion banner and a sibling link', () => {
    const rag = getTrack('rag')!;
    seedComplete(rag.items);
    renderAt('/tracks/rag');

    expect(
      screen.getByText(/finished retrieval-augmented generation/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /ai agents/i }),
    ).toHaveAttribute('href', '/tracks/agents');
    expect(
      screen.getByRole('progressbar', {
        name: /retrieval-augmented generation progress/i,
      }),
    ).toHaveAttribute('aria-valuenow', '17');
    expect(
      screen.getByRole('link', { name: /^review/i }),
    ).toBeInTheDocument();
  });
});
