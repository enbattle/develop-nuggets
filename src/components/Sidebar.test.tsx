import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { contentBySection } from '@/content';
import { SECTION_LABELS, sectionDomain } from '@/lib/sections';

const SECTIONS = contentBySection();

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar />
    </MemoryRouter>,
  );
}

describe('Sidebar', () => {
  it('renders a collapsible heading for every non-empty section', () => {
    renderAt('/');

    for (const { section } of SECTIONS) {
      expect(
        screen.getByRole('button', { name: SECTION_LABELS[section] }),
      ).toBeInTheDocument();
    }
  });

  it('starts every section collapsed off a content page', () => {
    renderAt('/');

    for (const { section } of SECTIONS) {
      expect(
        screen.getByRole('button', { name: SECTION_LABELS[section] }),
      ).toHaveAttribute('aria-expanded', 'false');
    }
    expect(
      screen.queryByRole('link', { name: 'Idempotency' }),
    ).not.toBeInTheDocument();
  });

  it('expands a section when its heading is clicked, without touching the others', async () => {
    const user = userEvent.setup();
    renderAt('/');

    const reliability = screen.getByRole('button', {
      name: 'Reliability & Resilience',
    });
    await user.click(reliability);

    expect(reliability).toHaveAttribute('aria-expanded', 'true');
    expect(
      screen.getByRole('link', { name: 'Idempotency' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Foundations' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );

    await user.click(reliability);
    expect(reliability).toHaveAttribute('aria-expanded', 'false');
    expect(
      screen.queryByRole('link', { name: 'Idempotency' }),
    ).not.toBeInTheDocument();
  });

  it('auto-expands the current item’s section and marks the item active', () => {
    renderAt('/nuggets/idempotency');

    expect(
      screen.getByRole('button', { name: 'Reliability & Resilience' }),
    ).toHaveAttribute('aria-expanded', 'true');

    const active = screen.getByRole('link', { name: 'Idempotency' });
    expect(active).toHaveAttribute('aria-current', 'page');
    expect(
      screen.getByRole('link', { name: 'Circuit Breaker' }),
    ).not.toHaveAttribute('aria-current');

    // A different section stays collapsed.
    expect(screen.getByRole('button', { name: 'Foundations' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('badges guides, not nuggets', () => {
    renderAt('/guides/redis');

    const guideLink = screen.getByRole('link', { name: /Redis/ });
    expect(within(guideLink).getByText('Guide')).toBeInTheDocument();

    const nuggetLink = screen.getByRole('link', { name: /Vector Databases/ });
    expect(within(nuggetLink).queryByText('Guide')).not.toBeInTheDocument();
  });

  it('super-groups sections under both domain headers', () => {
    renderAt('/');

    expect(
      screen.getByRole('button', { name: 'Systems & Infrastructure' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'AI Engineering' }),
    ).toBeInTheDocument();

    // Section headings still render under them.
    expect(
      screen.getByRole('button', { name: 'Foundations' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Retrieval & RAG' }),
    ).toBeInTheDocument();
  });

  it('spans both domains', () => {
    const domains = new Set(SECTIONS.map(({ section }) => sectionDomain(section)));
    expect(domains).toEqual(new Set(['systems', 'ai']));
  });

  it('calls onNavigate when a link is clicked', async () => {
    const user = userEvent.setup();
    const onNavigate = vi.fn();
    render(
      <MemoryRouter initialEntries={['/nuggets/idempotency']}>
        <Sidebar onNavigate={onNavigate} />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('link', { name: 'Idempotency' }));

    expect(onNavigate).toHaveBeenCalled();
  });
});
