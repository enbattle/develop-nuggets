import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test/utils';
import { HomePage } from './HomePage';
import { NUGGETS } from '@/content/nuggets';
import { readingProgress } from '@/lib/readingProgress';

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

  it('caps the initial list at 10 and loads the rest on demand', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    expect(screen.getAllByRole('listitem')).toHaveLength(PAGE_SIZE);
    const remaining = NUGGETS.length - PAGE_SIZE;
    const loadMoreButton = screen.getByRole('button', {
      name: new RegExp(`load ${remaining} more`, 'i'),
    });

    await user.click(loadMoreButton);

    expect(screen.getAllByRole('listitem')).toHaveLength(NUGGETS.length);
    expect(
      screen.queryByRole('button', { name: /load .* more/i }),
    ).not.toBeInTheDocument();
  });

  it('resets pagination when the tag filter changes', async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.click(screen.getByRole('button', { name: /load .* more/i }));
    expect(screen.getAllByRole('listitem')).toHaveLength(NUGGETS.length);

    await user.click(screen.getByRole('button', { name: 'apis' }));

    // 'apis' matches 4 nuggets — comfortably under PAGE_SIZE, so no leftover "Load more".
    expect(
      screen.queryByRole('button', { name: /load .* more/i }),
    ).not.toBeInTheDocument();
  });
});
