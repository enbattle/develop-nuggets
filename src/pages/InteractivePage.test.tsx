import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { ThemeProvider } from '@/contexts/ThemeContext';
import InteractivePage from './InteractivePage';
import { INTERACTIVE } from '@/components/interactive/registry';

// Each demo is a separate React.lazy() chunk; resolving Suspense can exceed
// the 1s findBy default on a loaded machine. Give the async lookups room.
const LAZY = { timeout: 5000 };

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <Routes>
          <Route path="/interactive" element={<InteractivePage />} />
          <Route path="/interactive/:id" element={<InteractivePage />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('InteractivePage', () => {
  it('lists all ten pipelines on the index, grouped by kind', () => {
    renderAt('/interactive');

    expect(
      screen.getByRole('heading', { name: 'Interactive RAG pipelines' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Step-through' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'Pipeline + code' }),
    ).toBeInTheDocument();

    for (const entry of INTERACTIVE) {
      expect(
        screen.getByRole('link', { name: new RegExp(entry.name, 'i') }),
      ).toHaveAttribute('href', `/interactive/${entry.id}`);
    }
    expect(INTERACTIVE).toHaveLength(10);
  });

  it('renders a known summary demo with its header and body', async () => {
    renderAt('/interactive/standard');

    expect(
      screen.getByRole('heading', { name: 'Standard RAG' }),
    ).toBeInTheDocument();
    // Lazy-loaded demo body.
    expect(await screen.findByText('Key insight', undefined, LAZY)).toBeInTheDocument();
    expect(
      await screen.findByRole('heading', { name: 'Worked trace' }, LAZY),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /back to all pipelines/i }),
    ).toHaveAttribute('href', '/interactive');
  });

  it('renders a known stepper demo with a step indicator', async () => {
    renderAt('/interactive/agentic');

    expect(
      screen.getByRole('heading', { name: 'Agentic RAG' }),
    ).toBeInTheDocument();
    expect(await screen.findByText(/step 1 of 9/i, undefined, LAZY)).toBeInTheDocument();
    expect(await screen.findByText('ReAct trace', undefined, LAZY)).toBeInTheDocument();
  });

  it('shows a not-found card for an unknown id', () => {
    renderAt('/interactive/does-not-exist');

    expect(
      screen.getByText('Interactive demo not found.'),
    ).toBeInTheDocument();
  });
});
