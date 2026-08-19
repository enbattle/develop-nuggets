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
// The catalog is bigger than PAGE_SIZE (10), so the last nugget alphabetically
// is guaranteed off the Nuggets tab's first page.
const laterNuggetTitle =
  alphabeticalNuggets[alphabeticalNuggets.length - 1].title;

const firstGuideTitle = [...GUIDES].sort((a, b) =>
  a.title.localeCompare(b.title),
)[0].title;

describe('App', () => {
  it('renders the header, the sidebar, and the default (Guides) home content', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dev Nuggets')).toBeInTheDocument();
    // Sidebar lists every nugget, including ones off the Nuggets tab's first page.
    expect(
      screen.getByRole('link', { name: laterNuggetTitle }),
    ).toBeInTheDocument();
    // Home page defaults to the Guides tab.
    expect(
      screen.getByRole('heading', { name: firstGuideTitle }),
    ).toBeInTheDocument();
  });

  it('switches to the Nuggets tab and shows the nugget catalog', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('tab', { name: 'Nuggets' }));

    expect(
      screen.getByRole('heading', { name: firstNuggetTitle }),
    ).toBeInTheDocument();
  });

  it('toggles the mobile nugget drawer open and closed', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(
      screen.getByRole('button', { name: /toggle nugget list/i }),
    );
    expect(
      screen.getByRole('dialog', { name: /all nuggets/i }),
    ).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
