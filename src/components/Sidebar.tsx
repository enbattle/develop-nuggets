import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import type { Nugget, Section } from '@/types';
import { contentBySection, contentPath, getContent } from '@/content';
import { SECTION_LABELS } from '@/lib/sections';
import { FORMAT_LABELS } from '@/lib/format';

interface SidebarProps {
  /** Called after a link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
}

// Content is static, so the section grouping is computed once at module load.
const SECTIONS = contentBySection();

// Indented further than the group heading (pl-6 vs. the heading's px-3) so
// topic names read as nested under it, not flush with it. The link itself
// still spans the full row — only the text is inset — so the hover/active
// background keeps using the full width instead of shrinking with the text.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2 rounded-md py-1.5 pl-6 pr-3 text-sm transition-colors ${
    isActive
      ? 'bg-accent/10 font-medium text-accent'
      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
  }`;

/** Which section the current route's item belongs to, or null off a content page. */
function useActiveSection(): Section | null {
  const { pathname } = useLocation();
  const id = pathname.match(/^\/(?:nuggets|guides)\/(.+)$/)?.[1];
  return (id && getContent(id)?.section) || null;
}

interface SidebarGroupProps {
  title: string;
  items: Nugget[];
  /** Only shown once there's more than one non-empty group — see `Sidebar`. */
  showHeading: boolean;
  /** The current route's item lives in this section — keep it expanded. */
  active: boolean;
  onNavigate?: () => void;
}

function SidebarGroup({
  title,
  items,
  showHeading,
  active,
  onNavigate,
}: SidebarGroupProps) {
  // Collapsed by default so the sidebar opens as a scannable list of section
  // names; only the section holding the current page starts expanded.
  const [open, setOpen] = useState(active);

  // Opening a link in a collapsed section (e.g. from "Related") should reveal
  // that section — but navigating never force-*closes* a section the reader
  // opened themselves, so this only ever sets `open` true.
  useEffect(() => {
    if (active) setOpen(true);
  }, [active]);

  const expanded = !showHeading || open;

  return (
    <div className="flex flex-col gap-0.5">
      {showHeading && (
        <h2 className="px-3 pb-1">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="flex w-full items-center gap-1 text-left text-xs font-semibold uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-secondary"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-3 w-3 shrink-0 transition-transform ${open ? 'rotate-90' : ''}`}
              aria-hidden
            >
              <path d="M9 6l6 6-6 6" />
            </svg>
            {title}
          </button>
        </h2>
      )}
      {expanded &&
        items.map((item) => (
          <NavLink
            key={item.id}
            to={contentPath(item)}
            onClick={onNavigate}
            className={linkClass}
          >
            <span className="truncate">{item.title}</span>
            {item.format === 'guide' && (
              <span className="shrink-0 rounded-full bg-bg-tertiary px-1.5 py-0.5 text-[0.6rem] font-medium uppercase tracking-wide text-text-tertiary">
                {FORMAT_LABELS.guide}
              </span>
            )}
          </NavLink>
        ))}
    </div>
  );
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const activeSection = useActiveSection();
  const showHeadings = SECTIONS.length > 1;

  return (
    <nav aria-label="All content" className="flex flex-col gap-4">
      {SECTIONS.map(({ section, items }) => (
        <SidebarGroup
          key={section}
          title={SECTION_LABELS[section]}
          items={items}
          showHeading={showHeadings}
          active={section === activeSection}
          onNavigate={onNavigate}
        />
      ))}
    </nav>
  );
}
