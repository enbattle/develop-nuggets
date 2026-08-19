import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen, within } from '@/test/utils';
import { HomePage } from './HomePage';
import { NUGGETS } from '@/content/nuggets';
import { GUIDES } from '@/content/guides';
import { readingProgress } from '@/lib/readingProgress';

// Guides is the default active tab — scoping queries to its tabpanel
// excludes the Nuggets tab's content, which isn't mounted until selected.
function guideListItems() {
  return within(
    screen.getByRole('tabpanel', { name: 'Guides' }),
  ).getAllByRole('listitem');
}

function nuggetListItems() {
  return within(
    screen.getByRole('tabpanel', { name: 'Nuggets' }),
  ).getAllByRole('listitem');
}

// Must match PaginatedContentList's own PAGE_SIZE constant.
const PAGE_SIZE = 10;

describe('HomePage', () => {
  it('defaults to the Guides tab, selected and marked in the tablist', () => {
    render(<HomePage />);

    expect(screen.getByRole('tab', { name: 'Guides' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByRole('tab', { name: 'Nuggets' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  });

  it('lists guides with their tags, alphabetically by title', () => {
    render(<HomePage />);

    const alphabeticallyFirst = [...GUIDES].sort((a, b) =>
      a.title.localeCompare(b.title),
    )[0];

    expect(screen.getByText(alphabeticallyFirst.title)).toBeInTheDocument();
    expect(screen.getAllByText('databases').length).toBeGreaterThan(0);
  });

  it('filters the guide list when a tag chip is clicked', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: 'databases' }));

    expect(screen.getByText('Redis')).toBeInTheDocument();
    expect(screen.queryByText('Networking: CDN')).not.toBeInTheDocument();
  });

  it('shows a continue-reading banner for the last-viewed nugget', () => {
    readingProgress.setLastViewedId('idempotency');

    render(<HomePage />);

    expect(screen.getByText(/continue reading/i)).toBeInTheDocument();
  });

  it('caps the initial guide list at 10 and loads more per click', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(guideListItems()).toHaveLength(Math.min(PAGE_SIZE, GUIDES.length));

    let loadMoreButton = screen.queryByRole('button', {
      name: /load .* more/i,
    });
    while (loadMoreButton) {
      const before = guideListItems().length;
      await user.click(loadMoreButton);
      const after = guideListItems().length;
      expect(after - before).toBeLessThanOrEqual(PAGE_SIZE);
      loadMoreButton = screen.queryByRole('button', {
        name: /load .* more/i,
      });
    }

    expect(guideListItems()).toHaveLength(GUIDES.length);
  });

  it('resets pagination when the guide tag filter changes', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    const loadMoreButton = screen.queryByRole('button', {
      name: /load .* more/i,
    });
    if (loadMoreButton) {
      await user.click(loadMoreButton);
    }
    expect(guideListItems()).toHaveLength(GUIDES.length);

    // 'messaging' matches far fewer guides than are currently shown, so a
    // stale "Load more" would be unreachable if pagination didn't reset.
    await user.click(screen.getByRole('button', { name: 'messaging' }));

    expect(
      screen.queryByRole('button', { name: /load .* more/i }),
    ).not.toBeInTheDocument();
  });

  it('switches to the Nuggets tab, independently tag-filterable', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('tab', { name: 'Nuggets' }));

    expect(screen.getByRole('tab', { name: 'Nuggets' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    const nuggetsPanel = screen.getByRole('tabpanel', { name: 'Nuggets' });
    expect(
      within(nuggetsPanel).getAllByRole('listitem').length,
    ).toBeGreaterThan(0);

    await user.click(
      within(nuggetsPanel).getByRole('button', { name: 'apis' }),
    );

    expect(screen.getByText('Idempotency')).toBeInTheDocument();
    expect(
      screen.queryByText('Expand-Contract Pattern'),
    ).not.toBeInTheDocument();
  });

  it('paginates the Nuggets tab independently of Guides', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('tab', { name: 'Nuggets' }));

    expect(nuggetListItems()).toHaveLength(PAGE_SIZE);

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
});
