import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test/utils';
import { HomePage } from './HomePage';
import { readingProgress } from '@/lib/readingProgress';

describe('HomePage', () => {
  it('lists the published nuggets with their tags', () => {
    render(<HomePage />);

    expect(screen.getByText('Expand-Contract Pattern')).toBeInTheDocument();
    expect(screen.getByText('Idempotency')).toBeInTheDocument();
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
});
