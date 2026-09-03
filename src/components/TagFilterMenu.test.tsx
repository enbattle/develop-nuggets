import { useState } from 'react';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@/test/utils';
import type { Tag } from '@/types';
import { TagFilterMenu } from './TagFilterMenu';

function Harness({ initial = [] as Tag[] }) {
  const [selected, setSelected] = useState<Tag[]>(initial);
  return (
    <>
      <TagFilterMenu selected={selected} onChange={setSelected} />
      <output data-testid="selection">{selected.join(',')}</output>
    </>
  );
}

describe('TagFilterMenu', () => {
  it('opens the popover from the trigger and closes on Escape', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /tags/i }));
    expect(
      screen.getByRole('dialog', { name: /filter by tag/i }),
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('checking tags emits an OR selection and updates the trigger count', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: /tags/i }));
    await user.click(screen.getByRole('checkbox', { name: 'databases' }));
    await user.click(screen.getByRole('checkbox', { name: 'reliability' }));

    expect(screen.getByTestId('selection')).toHaveTextContent(
      'databases,reliability',
    );
    // Trigger shows the active count.
    expect(
      screen.getByRole('button', { name: /tags 2/i }),
    ).toBeInTheDocument();
  });

  it('filters the checkbox list by the search field', async () => {
    const user = userEvent.setup();
    render(<Harness />);

    await user.click(screen.getByRole('button', { name: /tags/i }));
    await user.type(screen.getByRole('searchbox', { name: /filter tags/i }), 'data');

    expect(screen.getByRole('checkbox', { name: 'databases' })).toBeInTheDocument();
    expect(
      screen.queryByRole('checkbox', { name: 'reliability' }),
    ).not.toBeInTheDocument();
  });

  it('Clear removes every selected tag', async () => {
    const user = userEvent.setup();
    render(<Harness initial={['databases', 'apis']} />);

    await user.click(screen.getByRole('button', { name: /tags 2/i }));
    await user.click(screen.getByRole('button', { name: /clear/i }));

    expect(screen.getByTestId('selection')).toHaveTextContent('');
  });
});
