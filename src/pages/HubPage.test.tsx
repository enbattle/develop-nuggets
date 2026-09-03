import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { HubPage } from './HubPage';
import { CONTENT } from '@/content';
import { TRACKS } from '@/content/tracks';
import { curatedItems } from '@/content/curated';
import { sectionDomain } from '@/lib/sections';
import { resetDomain } from '@/hooks/useDomain';
import { readingProgress } from '@/lib/readingProgress';
import { trackProgress } from '@/lib/trackProgress';

function renderHub() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<HubPage />} />
          <Route path="/browse" element={<div>BROWSE PAGE</div>} />
          <Route path="/tracks" element={<div>TRACKS INDEX</div>} />
          <Route path="/nuggets/:id" element={<div>NUGGET</div>} />
          <Route path="/guides/:id" element={<div>GUIDE</div>} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

function trackLinkCount() {
  return screen
    .getAllByRole('link')
    .filter((el) => /^\/tracks\/[^/]+$/.test(el.getAttribute('href') ?? ''))
    .length;
}

beforeEach(() => {
  resetDomain();
});

describe('HubPage', () => {
  it('renders a hero with the app name and a search box', () => {
    renderHub();
    expect(
      screen.getByRole('heading', { level: 1, name: 'Dev Nuggets' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('shows two domain cards with counts and top section names', () => {
    renderHub();
    const region = screen.getByRole('region', { name: /browse by domain/i });

    const systemsCount = CONTENT.filter(
      (i) => sectionDomain(i.section) === 'systems',
    ).length;
    const systemsCard = within(region).getByRole('button', {
      name: /systems & infrastructure/i,
    });
    expect(systemsCard).toHaveTextContent(`${systemsCount} items`);
    expect(systemsCard).toHaveTextContent('Foundations');

    const aiCard = within(region).getByRole('button', {
      name: /ai engineering/i,
    });
    expect(aiCard).toHaveTextContent('9 tracks');
  });

  it('navigates a domain card to /browse', async () => {
    const user = userEvent.setup();
    renderHub();
    const region = screen.getByRole('region', { name: /browse by domain/i });

    await user.click(
      within(region).getByRole('button', { name: /ai engineering/i }),
    );
    expect(screen.getByText('BROWSE PAGE')).toBeInTheDocument();
  });

  it('lists every track and a See all link', () => {
    renderHub();
    expect(trackLinkCount()).toBe(TRACKS.length);
    expect(
      screen.getByRole('link', { name: /see all/i }),
    ).toHaveAttribute('href', '/tracks');
  });

  it('lists the curated Start here set', () => {
    renderHub();
    const heading = screen.getByRole('heading', { name: 'Start here' });
    const list = heading.parentElement!.querySelector('ul')!;
    for (const item of curatedItems()) {
      expect(within(list).getByText(item.title)).toBeInTheDocument();
    }
  });

  it('surfaces the last-viewed item in a resume card', () => {
    readingProgress.setLastViewedId('idempotency');
    renderHub();
    const card = screen.getByRole('region', {
      name: /pick up where you left off/i,
    });
    expect(within(card).getByText(/continue reading/i)).toBeInTheDocument();
    expect(within(card).getByText('Idempotency')).toBeInTheDocument();
  });

  it('surfaces an unfinished track with progress in the resume card', () => {
    trackProgress.setLastTrackId('rag');
    renderHub();
    const card = screen.getByRole('region', {
      name: /pick up where you left off/i,
    });
    expect(within(card).getByText(/resume track/i)).toBeInTheDocument();
    expect(
      within(card).getByText('Retrieval-Augmented Generation'),
    ).toBeInTheDocument();
    expect(within(card).getByRole('progressbar')).toBeInTheDocument();
  });

  it('collapses to a single row when the last item read is in the resume track', () => {
    readingProgress.setLastViewedId('what-is-rag'); // first item of the rag track
    trackProgress.setLastTrackId('rag');
    renderHub();

    const card = screen.getByRole('region', {
      name: /pick up where you left off/i,
    });
    expect(within(card).getByText(/resume track/i)).toBeInTheDocument();
    expect(
      within(card).queryByText(/continue reading/i),
    ).not.toBeInTheDocument();
    expect(within(card).getAllByRole('link')).toHaveLength(1);
  });

  it('shows two distinct rows when a standalone read and a track diverge', () => {
    readingProgress.setLastViewedId('idempotency'); // a nugget, in no track
    trackProgress.setLastTrackId('rag');
    renderHub();

    const card = screen.getByRole('region', {
      name: /pick up where you left off/i,
    });
    expect(within(card).getByText(/continue reading/i)).toBeInTheDocument();
    expect(within(card).getByText(/resume track/i)).toBeInTheDocument();
    expect(within(card).getAllByRole('link')).toHaveLength(2);
  });

  it('renders no resume card with a clean slate', () => {
    renderHub();
    expect(
      screen.queryByRole('region', { name: /pick up where you left off/i }),
    ).not.toBeInTheDocument();
  });
});
