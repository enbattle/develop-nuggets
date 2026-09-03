import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BrowsePage } from './BrowsePage';
import { CONTENT } from '@/content';
import { sectionDomain } from '@/lib/sections';
import { resetDomain } from '@/hooks/useDomain';

function renderAt(path = '/browse') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <Routes>
          <Route path="/browse" element={<BrowsePage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

/** Content-card links only — ignores the tag popover's own list items. */
function resultCount() {
  return screen
    .getAllByRole('link')
    .filter((el) =>
      /^\/(nuggets|guides)\//.test(el.getAttribute('href') ?? ''),
    ).length;
}

const SYSTEMS = CONTENT.filter((i) => sectionDomain(i.section) === 'systems');
const AI = CONTENT.filter((i) => sectionDomain(i.section) === 'ai');
const SYSTEMS_GUIDES = SYSTEMS.filter((i) => i.format === 'guide');

beforeEach(() => {
  resetDomain();
});

describe('BrowsePage', () => {
  it('has one filter toolbar holding every control', () => {
    renderAt();
    expect(
      screen.getByRole('group', { name: /filter by domain/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /filter by format/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('group', { name: /list density/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^tags/i }),
    ).toBeInTheDocument();
  });

  it('defaults to the Systems domain and scopes the section blocks to it', async () => {
    const user = userEvent.setup();
    renderAt();

    const domainGroup = screen.getByRole('group', { name: /filter by domain/i });
    expect(
      within(domainGroup).getByRole('button', {
        name: 'Systems & Infrastructure',
      }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(resultCount()).toBe(SYSTEMS.length);
    expect(
      screen.queryByRole('heading', { name: 'Retrieval & RAG' }),
    ).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: 'AI Engineering' }),
    );
    expect(resultCount()).toBe(AI.length);
    expect(
      screen.getByRole('heading', { name: 'Retrieval & RAG' }),
    ).toBeInTheDocument();
  });

  it('filters to guides only', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('button', { name: 'Guides' }));

    expect(screen.getByRole('heading', { name: 'Redis' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Reliability & Resilience' }),
    ).not.toBeInTheDocument();
    expect(resultCount()).toBe(SYSTEMS_GUIDES.length);
  });

  it('shows a live result count that updates with the filters', async () => {
    const user = userEvent.setup();
    renderAt();

    expect(
      screen.getByText(`${SYSTEMS.length} results`),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Guides' }));
    expect(
      screen.getByText(`${SYSTEMS_GUIDES.length} results`),
    ).toBeInTheDocument();
  });

  it('opens the tag menu and filters by a checked tag', async () => {
    const user = userEvent.setup();
    renderAt();

    await user.click(screen.getByRole('button', { name: /^tags/i }));
    await user.click(screen.getByRole('checkbox', { name: 'databases' }));

    expect(screen.getByRole('heading', { name: 'Redis' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Foundations' }),
    ).not.toBeInTheDocument();
  });

  it('renders active-tag chips only when tags are set, and they are dismissible', async () => {
    const user = userEvent.setup();
    renderAt();

    expect(
      screen.queryByRole('group', { name: /active tag filters/i }),
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^tags/i }));
    await user.click(screen.getByRole('checkbox', { name: 'databases' }));
    await user.keyboard('{Escape}');

    const chips = screen.getByRole('group', { name: /active tag filters/i });
    const chip = within(chips).getByRole('button', {
      name: /remove databases filter/i,
    });
    await user.click(chip);

    expect(
      screen.queryByRole('group', { name: /active tag filters/i }),
    ).not.toBeInTheDocument();
  });

  it('toggles list density', async () => {
    const user = userEvent.setup();
    renderAt();

    const densityGroup = screen.getByRole('group', { name: /list density/i });
    expect(
      within(densityGroup).getByRole('button', { name: 'Comfortable' }),
    ).toHaveAttribute('aria-pressed', 'true');

    await user.click(
      within(densityGroup).getByRole('button', { name: 'Compact' }),
    );
    expect(
      within(densityGroup).getByRole('button', { name: 'Compact' }),
    ).toHaveAttribute('aria-pressed', 'true');
    // Compact hides the summary/tag rows on the cards.
    const firstSummary = SYSTEMS.find((i) => i.summary)?.summary;
    if (firstSummary) {
      expect(screen.queryAllByText(firstSummary)).toHaveLength(0);
    }
  });

  it('seeds the domain from ?domain=', () => {
    renderAt('/browse?domain=ai');
    expect(resultCount()).toBe(AI.length);
    expect(
      screen.getByRole('heading', { name: 'Retrieval & RAG' }),
    ).toBeInTheDocument();
  });

  it('seeds tag filters from ?tag=', () => {
    renderAt('/browse?tag=databases');
    expect(
      screen.getByRole('group', { name: /active tag filters/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Redis' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Foundations' }),
    ).not.toBeInTheDocument();
  });
});
