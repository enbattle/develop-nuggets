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

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `truncate rounded-md px-3 py-1.5 text-sm transition-colors ${
    isActive
      ? 'bg-accent/10 font-medium text-accent'
      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
  }`;

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <nav aria-label="All nuggets" className="flex flex-col gap-4">
      {SORTED_GUIDES.length > 0 && (
        <div className="flex flex-col gap-0.5">
          <h2 className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Guides
          </h2>
          {SORTED_GUIDES.map((guide) => (
            <NavLink
              key={guide.id}
              to={contentPath(guide)}
              onClick={onNavigate}
              className={linkClass}
            >
              {guide.title}
            </NavLink>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-0.5">
        {SORTED_GUIDES.length > 0 && (
          <h2 className="px-3 pb-1 text-xs font-semibold uppercase tracking-wide text-text-tertiary">
            Nuggets
          </h2>
        )}
        {SORTED_NUGGETS.map((nugget) => (
          <NavLink
            key={nugget.id}
            to={contentPath(nugget)}
            onClick={onNavigate}
            className={linkClass}
          >
            {nugget.title}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
