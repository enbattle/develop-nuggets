import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { NUGGETS } from '@/content/nuggets';

const alphabetical = [...NUGGETS].sort((a, b) =>
  a.title.localeCompare(b.title),
);
const firstPageTitle = alphabetical[0].title;
// 16 nuggets > PAGE_SIZE (10), so the last alphabetically is guaranteed off the home page's first page.
const laterPageTitle = alphabetical[alphabetical.length - 1].title;

describe('App', () => {
  it('renders the header, the sidebar, and the nugget catalog', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>,
    );

    expect(screen.getByText('Dev Nuggets')).toBeInTheDocument();
    // Sidebar lists every nugget, including ones off the home page's first page.
    expect(
      screen.getByRole('link', { name: laterPageTitle }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: firstPageTitle }),
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
