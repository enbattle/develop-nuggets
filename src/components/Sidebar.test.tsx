import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Sidebar } from './Sidebar';
import { contentBySection } from '@/content';
import { DOMAIN_SHORT_LABELS, SECTION_LABELS, sectionDomain } from '@/lib/sections';
import { resetDomain } from '@/hooks/useDomain';

const SECTIONS = contentBySection();
const SYSTEMS_SECTIONS = SECTIONS.filter(
  ({ section }) => sectionDomain(section) === 'systems',
);
const AI_SECTIONS = SECTIONS.filter(
  ({ section }) => sectionDomain(section) === 'ai',
);

function renderAt(path = '/') {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Sidebar />
    </MemoryRouter>,
  );
}

beforeEach(() => {
  resetDomain();
});

describe('Sidebar', () => {
  it('pins a two-segment domain switcher that is a group, not a heading', () => {
    renderAt('/');

    const group = screen.getByRole('group', { name: 'Domain' });
    const systems = within(group).getByRole('button', {
      name: DOMAIN_SHORT_LABELS.systems,
    });
    const ai = within(group).getByRole('button', { name: DOMAIN_SHORT_LABELS.ai });

    expect(systems).toHaveAttribute('aria-pressed', 'true');
    expect(ai).toHaveAttribute('aria-pressed', 'false');
    expect(
      screen.queryByRole('heading', { name: DOMAIN_SHORT_LABELS.systems }),
    ).not.toBeInTheDocument();
  });

  it('shows only the active domain’s section headings, and switches on toggle', async () => {
    const user = userEvent.setup();
    renderAt('/');

    // Systems is the default domain.
    for (const { section } of SYSTEMS_SECTIONS) {
      expect(
        screen.getByRole('heading', { name: SECTION_LABELS[section] }),
      ).toBeInTheDocument();
    }
    for (const { section } of AI_SECTIONS) {
      expect(
        screen.queryByRole('heading', { name: SECTION_LABELS[section] }),
      ).not.toBeInTheDocument();
    }

    await user.click(screen.getByRole('button', { name: DOMAIN_SHORT_LABELS.ai }));

    for (const { section } of AI_SECTIONS) {
      expect(
        screen.getByRole('heading', { name: SECTION_LABELS[section] }),
      ).toBeInTheDocument();
    }
    expect(
      screen.queryByRole('heading', {
        name: SECTION_LABELS[SYSTEMS_SECTIONS[0].section],
      }),
    ).not.toBeInTheDocument();
  });

  it('uses a single accordion heading tier for sections', () => {
    renderAt('/');

    for (const { section } of SYSTEMS_SECTIONS) {
      const heading = screen.getByRole('heading', {
        name: SECTION_LABELS[section],
      });
      // The WAI-ARIA accordion pattern: an <h2> wrapping a disclosure button.
      expect(heading.tagName).toBe('H2');
      expect(
        within(heading).getByRole('button', { name: SECTION_LABELS[section] }),
      ).toHaveAttribute('aria-expanded');
    }
  });

  it('starts every section collapsed off a content page', () => {
    renderAt('/');

    for (const { section } of SYSTEMS_SECTIONS) {
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

  it('follows navigation into the other domain', () => {
    renderAt('/guides/building-first-rag');

    expect(
      screen.getByRole('button', { name: DOMAIN_SHORT_LABELS.ai }),
    ).toHaveAttribute('aria-pressed', 'true');
    expect(
      screen.getByRole('button', { name: 'Retrieval & RAG' }),
    ).toHaveAttribute('aria-expanded', 'true');
  });

  it('draws a connector line and an accent notch on the active row', () => {
    renderAt('/nuggets/idempotency');

    const active = screen.getByRole('link', { name: 'Idempotency' });
    expect(active.className).toContain('border-accent');
    expect(active.className).toContain('bg-accent/5');

    const list = active.closest('ul');
    expect(list).not.toBeNull();
    expect(list?.className).toContain('border-l');
  });

  it('marks guides with a muted trailing signal, not nuggets', () => {
    renderAt('/guides/redis');

    const guideLink = screen.getByRole('link', { name: /Redis/ });
    expect(within(guideLink).getByText(/·\s*guide/)).toBeInTheDocument();

    const nuggetLink = screen.getByRole('link', { name: /Vector Databases/ });
    expect(within(nuggetLink).queryByText(/·\s*guide/)).not.toBeInTheDocument();
  });

  it('shows a domain › section context crumb only on a content page', () => {
    const { unmount } = renderAt('/');
    expect(screen.queryByText(/›/)).not.toBeInTheDocument();
    unmount();

    renderAt('/nuggets/idempotency');
    expect(
      screen.getByText(/Systems.*›.*Reliability & Resilience/),
    ).toBeInTheDocument();
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
