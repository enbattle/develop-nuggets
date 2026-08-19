import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@/test/utils';
import { HomePage } from './HomePage';
import { NUGGETS } from '@/content/nuggets';
import { readingProgress } from '@/lib/readingProgress';

// Nugget list items live in the "Nuggets" region — scoping queries there
// excludes the separate, unpaginated "Guides" section's list items.
function nuggetListItems() {
  return within(screen.getByRole('region', { name: 'Nuggets' })).getAllByRole(
    'listitem',
  );
}

// Must match HomePage's own PAGE_SIZE constant.
const PAGE_SIZE = 10;

describe('HomePage', () => {
  it('lists nuggets with their tags, alphabetically by title', () => {
    render(<HomePage />);

    const alphabeticallyFirst = [...NUGGETS].sort((a, b) =>
      a.title.localeCompare(b.title),
    )[0];

    expect(screen.getByText(alphabeticallyFirst.title)).toBeInTheDocument();
    expect(screen.getAllByText('patterns').length).toBeGreaterThan(0);
  });

  it('filters the list when a tag chip is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'apis' }));

    expect(screen.getByText('Idempotency')).toBeInTheDocument();
    expect(
      screen.queryByText('Expand-Contract Pattern'),
    ).not.toBeInTheDocument();
  });

  it('shows a continue-reading banner for the last-viewed nugget', () => {
    readingProgress.setLastViewedId('idempotency');

    render(<HomePage />);

    expect(screen.getByText(/continue reading/i)).toBeInTheDocument();
  });

  it('caps the initial list at 10 and loads 10 more per click', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(nuggetListItems()).toHaveLength(PAGE_SIZE);

    // Each click reveals at most PAGE_SIZE more, however many pages that takes.
    let loadMoreButton = screen.queryByRole('button', {
      name: /load .* more/i,
    });
    while (loadMoreButton) {
      const before = nuggetListItems().length;
      await user.click(loadMoreButton);
      const after = nuggetListItems().length;
      expect(after - before).toBeLessThanOrEqual(PAGE_SIZE);
      loadMoreButton = screen.queryByRole('button', {
        name: /load .* more/i,
      });
    }

    expect(nuggetListItems()).toHaveLength(NUGGETS.length);
  });

  it('resets pagination when the tag filter changes', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /load .* more/i }));
    expect(nuggetListItems()).toHaveLength(PAGE_SIZE * 2);

    await user.click(screen.getByRole('button', { name: 'apis' }));

    // 'apis' matches far fewer than PAGE_SIZE nuggets, so no leftover "Load more".
    expect(
      screen.queryByRole('button', { name: /load .* more/i }),
    ).not.toBeInTheDocument();
  });
});
