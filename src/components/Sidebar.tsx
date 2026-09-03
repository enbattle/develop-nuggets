import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { Nugget, Section } from '@/types';
import { contentBySection, contentPath, getContent } from '@/content';
import {
  DOMAIN_ORDER,
  DOMAIN_SHORT_LABELS,
  SECTION_LABELS,
  sectionDomain,
  type Domain,
} from '@/lib/sections';
import { FORMAT_LABELS } from '@/lib/format';
import { useDomain } from '@/hooks/useDomain';
import { SegmentedControl } from './SegmentedControl';

const DOMAIN_OPTIONS = DOMAIN_ORDER.map((id) => ({
  value: id,
  label: DOMAIN_SHORT_LABELS[id],
}));

interface SidebarProps {
  /** Called after a link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
}

// Content is static, so the section grouping is computed once at module load.
const SECTIONS = contentBySection();

// Short domain name for the "Systems › Reliability" context crumb. Keyed by
// the `Domain` union so a new domain has to be given a crumb label here.
const DOMAIN_CRUMB: Record<Domain, string> = {
  systems: 'Systems',
  ai: 'AI Engineering',
};

// Each section's links sit in a `<ul>` with a `border-l` connector tying them
// to the heading (Law of Uniform Connectedness). The active row notches a
// pixel left so its accent border sits on top of the connector line.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 rounded-r py-1 pl-2 pr-2 text-sm transition-colors ${
    isActive
      ? '-ml-px border-l-2 border-accent bg-accent/5 font-medium text-accent'
      : 'border-l-2 border-transparent text-text-secondary hover:bg-bg-secondary hover:text-text-primary'
  }`;

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-2.5 w-2.5 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
      aria-hidden
    >
      <path d="M9 6l6 6-6 6" />
    </svg>
  );
}

/** Which section the current route's item belongs to, or null off a content page. */
function useActiveSection(): Section | null {
  const { pathname } = useLocation();
  const id = pathname.match(/^\/(?:nuggets|guides)\/(.+)$/)?.[1];
  return (id && getContent(id)?.section) || null;
}

interface SidebarSectionProps {
  section: Section;
  items: Nugget[];
  /** The current route's item lives in this section — keep it expanded. */
  active: boolean;
  onNavigate?: () => void;
}

function SidebarSection({
  section,
  items,
  active,
  onNavigate,
}: SidebarSectionProps) {
  // Collapsed by default so the sidebar opens as a scannable list of section
  // names; only the section holding the current page starts expanded.
  const [open, setOpen] = useState(active);

  // Opening a link in a collapsed section (e.g. from "Related") reveals it —
  // but navigating never force-*closes* a section the reader opened, so this
  // only ever sets `open` true.
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  return (
    <div>
      <h2 className="mb-1 mt-6 px-3">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className="flex w-full items-center gap-1 text-left text-[0.7rem] font-semibold uppercase tracking-[0.08em] text-text-tertiary transition-colors hover:text-text-secondary"
        >
          <Chevron open={open} />
          {SECTION_LABELS[section]}
        </button>
      </h2>
      {open && (
        <ul className="ml-3 flex flex-col border-l border-border py-1 pl-3">
          {items.map((item) => (
            <li key={item.id}>
              <NavLink
                to={contentPath(item)}
                onClick={onNavigate}
                className={linkClass}
              >
                <span className="min-w-0 flex-1 truncate">{item.title}</span>
                {item.format === 'guide' && (
                  <span className="shrink-0 text-[0.7rem] text-text-tertiary">
                    · {FORMAT_LABELS.guide.toLowerCase()}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const [domain, setDomain] = useDomain();
  const activeSection = useActiveSection();

  // Opening a content page switches the sidebar (and every other `useDomain`
  // consumer) to that item's domain, so its section is visible and can
  // auto-expand. Manual switching to browse the other domain still works.
  useEffect(() => {
    if (activeSection) setDomain(sectionDomain(activeSection));
  }, [activeSection, setDomain]);

  const sections = SECTIONS.filter(
    ({ section }) => sectionDomain(section) === domain,
  );

  return (
    <nav aria-label="All content" className="flex flex-col">
      <SegmentedControl
        label="Domain"
        options={DOMAIN_OPTIONS}
        value={domain}
        onChange={setDomain}
        stretch
      />

      {activeSection && (
        <p className="mt-3 px-3 text-[0.7rem] text-text-tertiary">
          {`${DOMAIN_CRUMB[sectionDomain(activeSection)]} › ${SECTION_LABELS[activeSection]}`}
        </p>
      )}

      <div className="flex flex-col">
        {sections.map(({ section, items }) => (
          <SidebarSection
            key={section}
            section={section}
            items={items}
            active={section === activeSection}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    </nav>
  );
}
