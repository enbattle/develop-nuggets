import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { resetDomain } from '@/hooks/useDomain';

function renderApp(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  resetDomain();
});

describe('App', () => {
  it('renders the hub at / — header search, domain cards, tracks, and Start here', () => {
    renderApp('/');

    expect(
      screen.getByRole('heading', { level: 1, name: 'Dev Nuggets' }),
    ).toBeInTheDocument();
    // One search box, in the header — the hub no longer has its own.
    expect(screen.getAllByRole('searchbox')).toHaveLength(1);
    // Primary nav is present on every page.
    expect(
      screen.getByRole('link', { name: 'Browse' }),
    ).toHaveAttribute('href', '/browse');

    // Two domain cards, inside the "Browse by domain" region.
    const domainRegion = screen.getByRole('region', {
      name: /browse by domain/i,
    });
    expect(
      within(domainRegion).getByRole('button', {
        name: /systems & infrastructure/i,
      }),
    ).toBeInTheDocument();
    expect(
      within(domainRegion).getByRole('button', { name: /ai engineering/i }),
    ).toBeInTheDocument();

    // Tracks section and the curated "Start here" list.
    expect(
      screen.getByRole('heading', { name: 'Tracks' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Start here' }),
    ).toBeInTheDocument();

    // The hub is a landing, not the firehose — the routed content has no
    // section charter blocks (the sidebar's section list is a separate <aside>).
    const main = screen.getByRole('main');
    expect(
      within(main).queryByRole('heading', { name: 'Reliability & Resilience' }),
    ).not.toBeInTheDocument();
  });

  it('navigates from a hub domain card to the pre-filtered browse page', async () => {
    const user = userEvent.setup();
    renderApp('/');

    const domainRegion = screen.getByRole('region', {
      name: /browse by domain/i,
    });
    await user.click(
      within(domainRegion).getByRole('button', { name: /ai engineering/i }),
    );

    // Browse page toolbar, scoped to the AI domain.
    const domainGroup = screen.getByRole('group', { name: /filter by domain/i });
    expect(
      within(domainGroup).getByRole('button', { name: 'AI Engineering' }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      within(screen.getByRole('main')).getByRole('heading', {
        name: 'Retrieval & RAG',
      }),
    ).toBeInTheDocument();
  });

  it('toggles the mobile navigation drawer open and closed', async () => {
    const user = userEvent.setup();
    renderApp('/');

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /toggle navigation/i }),
    );
    expect(
      screen.getByRole('dialog', { name: /all content/i }),
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
