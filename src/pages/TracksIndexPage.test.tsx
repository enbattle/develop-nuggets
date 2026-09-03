import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { TracksIndexPage } from './TracksIndexPage';
import { TRACKS } from '@/content/tracks';

function renderPage() {
  return render(
    <MemoryRouter initialEntries={['/tracks']}>
      <ThemeProvider>
        <Routes>
          <Route path="/tracks" element={<TracksIndexPage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('TracksIndexPage', () => {
  it('renders a heading and one card per track', () => {
    renderPage();

    expect(
      screen.getByRole('heading', { level: 1, name: 'Tracks' }),
    ).toBeInTheDocument();

    for (const track of TRACKS) {
      expect(
        screen.getByRole('link', { name: new RegExp(track.title, 'i') }),
      ).toHaveAttribute('href', `/tracks/${track.id}`);
    }
  });

  it('shows a progress bar on every track card', () => {
    renderPage();
    expect(screen.getAllByRole('progressbar')).toHaveLength(TRACKS.length);
  });
});
