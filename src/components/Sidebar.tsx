import { NavLink } from 'react-router-dom';
import { NUGGETS } from '@/content/nuggets';

interface SidebarProps {
  /** Called after a link is clicked — used to close the mobile drawer. */
  onNavigate?: () => void;
}

const SORTED_NUGGETS = [...NUGGETS].sort((a, b) =>
  a.title.localeCompare(b.title),
);

export function Sidebar({ onNavigate }: SidebarProps) {
  return (
    <nav aria-label="All nuggets" className="flex flex-col gap-0.5">
      {SORTED_NUGGETS.map((nugget) => (
        <NavLink
          key={nugget.id}
          to={`/nuggets/${nugget.id}`}
          onClick={onNavigate}
          className={({ isActive }) =>
            `truncate rounded-md px-3 py-1.5 text-sm transition-colors ${
              isActive
                ? 'bg-accent/10 font-medium text-accent'
                : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary'
            }`
          }
        >
          {nugget.title}
        </NavLink>
      ))}
    </nav>
  );
}
