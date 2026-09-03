import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';

function renderApp(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}

describe('useGlobalShortcuts', () => {
  it('pages to the next / previous item in the section with j / k', async () => {
    const user = userEvent.setup();
    renderApp('/nuggets/idempotency');

    expect(
      screen.getByRole('heading', { name: 'Idempotency', level: 1 }),
    ).toBeInTheDocument();

    // Reliability & Resilience order: … Exponential Backoff & Jitter,
    // Idempotency, Observability, …
    await user.keyboard('j');
    expect(
      await screen.findByRole('heading', { name: /^Observability/, level: 1 }),
    ).toBeInTheDocument();

    await user.keyboard('k');
    expect(
      await screen.findByRole('heading', { name: 'Idempotency', level: 1 }),
    ).toBeInTheDocument();
  });

  it('does nothing for j / k away from a content page', async () => {
    const user = userEvent.setup();
    renderApp('/');

    await user.keyboard('j');
    // Still on the hub (its "Browse by domain" region is present).
    expect(
      screen.getByRole('region', { name: /browse by domain/i }),
    ).toBeInTheDocument();
  });

  it('opens the shortcuts modal with ? and closes it on Escape', async () => {
    const user = userEvent.setup();
    renderApp('/');

    expect(
      screen.queryByRole('dialog', { name: /keyboard shortcuts/i }),
    ).not.toBeInTheDocument();

    await user.keyboard('?');
    expect(
      screen.getByRole('dialog', { name: /keyboard shortcuts/i }),
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(
      screen.queryByRole('dialog', { name: /keyboard shortcuts/i }),
    ).not.toBeInTheDocument();
  });

  it('ignores j / k while typing in the search field', async () => {
    const user = userEvent.setup();
    renderApp('/nuggets/idempotency');

    await user.click(screen.getByRole('searchbox'));
    await user.keyboard('j');

    expect(
      screen.getByRole('heading', { name: 'Idempotency', level: 1 }),
    ).toBeInTheDocument();
  });
});
