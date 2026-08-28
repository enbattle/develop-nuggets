import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test/utils';
import { HomePage } from './HomePage';
import { CONTENT } from '@/content';
import { GUIDES } from '@/content/guides';
import { SECTION_DESCRIPTIONS } from '@/lib/sections';
import { readingProgress } from '@/lib/readingProgress';

function cardCount() {
  return screen.queryAllByRole('listitem').length;
}

describe('HomePage', () => {
  it('groups content into topic sections, each with a heading and charter', () => {
    render(<HomePage />);

    expect(
      screen.getByRole('heading', { name: 'Foundations' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(SECTION_DESCRIPTIONS.foundations),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Reliability & Resilience' }),
    ).toBeInTheDocument();
  });

  it('shows every item as a card by default', () => {
    render(<HomePage />);
    expect(cardCount()).toBe(CONTENT.length);
  });

  it('shows a continue-reading banner for the last-viewed item', () => {
    readingProgress.setLastViewedId('idempotency');
    render(<HomePage />);
    expect(screen.getByText(/continue reading/i)).toBeInTheDocument();
  });

  it('filters to guides only, dropping nugget-only sections', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Guides' }));

    expect(screen.getByRole('heading', { name: 'Redis' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Idempotency' }),
    ).not.toBeInTheDocument();
    // Reliability & Resilience is entirely nuggets — its section disappears.
    expect(
      screen.queryByRole('heading', { name: 'Reliability & Resilience' }),
    ).not.toBeInTheDocument();
    expect(cardCount()).toBe(GUIDES.length);
  });

  it('filters by tag across sections', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'databases' }));

    expect(screen.getByRole('heading', { name: 'Redis' })).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Idempotency' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: 'Foundations' }),
    ).not.toBeInTheDocument();
  });

  it('combines the format and tag filters', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Guides' }));
    await user.click(screen.getByRole('button', { name: 'databases' }));

    const expected = GUIDES.filter((g) => g.tags.includes('databases')).length;
    expect(cardCount()).toBe(expected);
    expect(
      screen.getByRole('heading', { name: 'Data Stores' }),
    ).toBeInTheDocument();
  });

  it('shows an empty state when no item matches the filter', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'Guides' }));
    await user.click(screen.getByRole('button', { name: 'testing' }));

    expect(screen.getByText(/nothing matches/i)).toBeInTheDocument();
    expect(cardCount()).toBe(0);
  });

  it('shows the whole catalog at once — no pagination', () => {
    render(<HomePage />);

    expect(
      screen.queryByRole('button', { name: /load .* more/i }),
    ).not.toBeInTheDocument();
    // A late-alphabet item that a paginated first page would have hidden.
    expect(
      screen.getByRole('heading', { name: 'Vector Databases' }),
    ).toBeInTheDocument();
  });
});
