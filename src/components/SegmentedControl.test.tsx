import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SegmentedControl } from './SegmentedControl';

const OPTIONS = [
  { value: 'a', label: 'Alpha' },
  { value: 'b', label: 'Beta' },
  { value: 'c', label: 'Gamma' },
];

describe('SegmentedControl', () => {
  it('is a labelled group with one aria-pressed segment', () => {
    render(
      <SegmentedControl
        label="Pick one"
        options={OPTIONS}
        value="b"
        onChange={() => {}}
      />,
    );

    const group = screen.getByRole('group', { name: 'Pick one' });
    expect(within(group).getByRole('button', { name: 'Beta' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(within(group).getByRole('button', { name: 'Alpha' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('reports the chosen value on click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <SegmentedControl
        label="Pick one"
        options={OPTIONS}
        value="a"
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Gamma' }));
    expect(onChange).toHaveBeenCalledWith('c');
  });

  it('stretches its segments to fill the width when asked', () => {
    render(
      <SegmentedControl
        label="Pick one"
        options={OPTIONS}
        value="a"
        onChange={() => {}}
        stretch
      />,
    );
    const group = screen.getByRole('group', { name: 'Pick one' });
    expect(group.className).toContain('w-full');
    expect(
      within(group).getByRole('button', { name: 'Alpha' }).className,
    ).toContain('flex-1');
  });
});
