import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import type { Nugget } from '@/types';
import { NUGGETS } from '@/content/nuggets';
import { GUIDES } from '@/content/guides';
import { contentPath } from '@/content';

interface SidebarProps {
  /** Called after a link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
}

function byTitle(a: Nugget, b: Nugget) {
  return a.title.localeCompare(b.title);
}

const SORTED_GUIDES = [...GUIDES].sort(byTitle);
const SORTED_NUGGETS = [...NUGGETS].sort(byTitle);

// Indented further than the group heading (pl-6 vs. the heading's px-3) so
// topic names read as nested under it, not flush with it. The link itself
// still spans the full row — only the text is inset — so the hover/active
// background keeps using the full width instead of shrinking with the text.
const linkClass = ({ isActive }: { isActive: boolean }) =>
  `truncate rounded-md py-1.5 pl-6 pr-3 text-sm transition-colors ${
    isActive
      ? 'bg-accent/10 font-medium text-accent'
      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
  }`;

interface SidebarGroupProps {
  title: string;
  items: Nugget[];
  /** Only shown once there's more than one non-empty group — see `Sidebar`. */
  showHeading: boolean;
  onNavigate?: () => void;
}

function SidebarGroup({
  title,
  items,
  showHeading,
  onNavigate,
}: SidebarGroupProps) {
  const [open, setOpen] = useState(true);
  const expanded = !showHeading || open;

  return (
    <div className="flex flex-col gap-0.5">
      {showHeading && (
        <h2 className="px-3 pb-1">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            className="flex w-full items-center gap-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary transition-colors hover:text-text-secondary"
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
            {item.title}
          </NavLink>
        ))}
    </div>
  );
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const nonEmptyGroups = [SORTED_GUIDES, SORTED_NUGGETS].filter(
    (group) => group.length > 0,
  ).length;
  const showHeadings = nonEmptyGroups > 1;

  return (
    <nav aria-label="All nuggets" className="flex flex-col gap-4">
      <SidebarGroup
        title="Guides"
        items={SORTED_GUIDES}
        showHeading={showHeadings}
        onNavigate={onNavigate}
      />
      <SidebarGroup
        title="Nuggets"
        items={SORTED_NUGGETS}
        showHeading={showHeadings}
        onNavigate={onNavigate}
      />
    </nav>
  );
}
