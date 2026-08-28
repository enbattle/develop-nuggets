import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { NUGGETS } from '@/content/nuggets';
import { GUIDES } from '@/content/guides';

const alphabeticalNuggets = [...NUGGETS].sort((a, b) =>
  a.title.localeCompare(b.title),
);
const firstNuggetTitle = alphabeticalNuggets[0].title;

const firstGuideTitle = [...GUIDES].sort((a, b) =>
  a.title.localeCompare(b.title),
)[0].title;

describe('App', () => {
  it('renders the header, the section sidebar, and the full home catalog', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dev Nuggets')).toBeInTheDocument();
    // Sidebar groups content into collapsible topic sections.
    expect(
      screen.getByRole('button', { name: 'Foundations' }),
    ).toBeInTheDocument();
    // Home page lists both formats, unfiltered, by default.
    expect(
      screen.getByRole('heading', { name: firstGuideTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: firstNuggetTitle }),
    ).toBeInTheDocument();
  });

  it('filters the home catalog to nuggets only', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Nuggets' }));

    expect(
      screen.getByRole('heading', { name: firstNuggetTitle }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: firstGuideTitle }),
    ).not.toBeInTheDocument();
  });

  it('toggles the mobile navigation drawer open and closed', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /toggle navigation/i }),
    );
    expect(
      screen.getByRole('dialog', { name: /all content/i }),
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
