import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes, useParams } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { SearchBar } from './SearchBar';

function NuggetMarker() {
  const { id } = useParams<{ id: string }>();
  return <div>NUGGET PAGE: {id}</div>;
}

function GuideMarker() {
  const { id } = useParams<{ id: string }>();
  return <div>GUIDE PAGE: {id}</div>;
}

function renderSearchBar() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<SearchBar />} />
          <Route path="/nuggets/:id" element={<NuggetMarker />} />
          <Route path="/guides/:id" element={<GuideMarker />} />
        </Routes>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe('SearchBar', () => {
  it('shows a format badge on every result — Nugget or Guide', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole('searchbox'), 'idempotency');
    const nuggetResult = screen.getByRole('button', { name: /idempotency/i });
    expect(within(nuggetResult).getByText('Nugget')).toBeInTheDocument();

    await user.clear(screen.getByRole('searchbox'));
    await user.type(screen.getByRole('searchbox'), 'redis');
    const guideResult = screen.getByRole('button', { name: /redis/i });
    expect(within(guideResult).getByText('Guide')).toBeInTheDocument();
  });

  it('navigates to /guides/:id for a guide result', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole('searchbox'), 'redis');
    await user.click(screen.getByRole('button', { name: /redis/i }));

    expect(screen.getByText('GUIDE PAGE: redis')).toBeInTheDocument();
  });

  it('navigates to /nuggets/:id for a nugget result', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole('searchbox'), 'idempotency');
    await user.click(screen.getByRole('button', { name: /idempotency/i }));

    expect(screen.getByText('NUGGET PAGE: idempotency')).toBeInTheDocument();
  });

  it('navigates to the top result on Enter', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole('searchbox'), 'idempotency{Enter}');

    expect(screen.getByText('NUGGET PAGE: idempotency')).toBeInTheDocument();
  });

  it('clears the query on Escape', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    const input = screen.getByRole('searchbox');
    await user.type(input, 'idempotency');
    expect(input).toHaveValue('idempotency');

    await user.keyboard('{Escape}');
    expect(input).toHaveValue('');
  });

  it('shows "No matches." for a query matching nothing', async () => {
    const user = userEvent.setup();
    renderSearchBar();

    await user.type(screen.getByRole('searchbox'), 'zzzznonexistentzzzz');

    expect(screen.getByText('No matches.')).toBeInTheDocument();
  });
});
