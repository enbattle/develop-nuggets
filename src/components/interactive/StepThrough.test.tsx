import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@/test/utils';
import { StepThrough, type Step } from './StepThrough';

const STEPS: Step[] = [
  { caption: 'First state', activeNodeIds: ['a'], activeEdgeIds: [] },
  { caption: 'Second state', activeNodeIds: ['b'], activeEdgeIds: ['e1'] },
  { caption: 'Third state', activeNodeIds: ['c'], activeEdgeIds: [] },
];

const diagram = (
  <svg>
    <g data-node-id="a" />
    <g data-node-id="b" />
    <g data-node-id="c" />
    <path data-edge-id="e1" />
  </svg>
);

function setup(onStepChange?: (i: number) => void) {
  return render(
    <StepThrough steps={STEPS} diagram={diagram} onStepChange={onStepChange} />,
  );
}

describe('StepThrough', () => {
  it('starts on the first step', () => {
    setup();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(screen.getByText('First state')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /prev/i })).toBeDisabled();
  });

  it('advances and rewinds with the buttons and reports the step', () => {
    const onStepChange = vi.fn();
    setup(onStepChange);

    fireEvent.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    expect(screen.getByText('Second state')).toBeInTheDocument();
    expect(onStepChange).toHaveBeenLastCalledWith(1);

    fireEvent.click(screen.getByRole('button', { name: /prev/i }));
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    expect(onStepChange).toHaveBeenLastCalledWith(0);
  });

  it('highlights the diagram nodes and edges for the current step', () => {
    const { container } = setup();

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    expect(container.querySelector('[data-node-id="b"]')).toHaveClass('is-active');
    expect(container.querySelector('[data-edge-id="e1"]')).toHaveClass('is-active');
    // Step 1's node is now in the visited state.
    expect(container.querySelector('[data-node-id="a"]')).toHaveClass(
      'is-visited',
    );
  });

  it('responds to the arrow keys and resets with R', () => {
    setup();

    fireEvent.keyDown(window, { key: 'ArrowRight' });
    fireEvent.keyDown(window, { key: 'ArrowRight' });
    expect(screen.getByText('Step 3 of 3')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();

    fireEvent.keyDown(window, { key: 'ArrowLeft' });
    expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'r' });
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('ignores arrow keys while a form field has focus', () => {
    render(
      <>
        <input aria-label="field" />
        <StepThrough steps={STEPS} diagram={diagram} />
      </>,
    );
    const input = screen.getByLabelText('field');
    input.focus();

    fireEvent.keyDown(input, { key: 'ArrowRight' });
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('renders code tabs and switches between them', () => {
    render(
      <StepThrough
        steps={STEPS}
        diagram={diagram}
        code={[
          { label: 'One', lang: 'text', source: 'alpha_source_marker' },
          { label: 'Two', lang: 'text', source: 'beta_source_marker' },
        ]}
      />,
    );

    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('alpha_source_marker')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('tab', { name: 'Two' }));
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    expect(screen.getByText('beta_source_marker')).toBeInTheDocument();
  });
});
