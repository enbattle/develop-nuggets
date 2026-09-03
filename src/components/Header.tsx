import { Link, NavLink } from 'react-router-dom';
import type { RefObject } from 'react';
import { PRIMARY_NAV } from '@/lib/nav';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-md px-2 py-1 text-sm font-medium transition-colors ${
    isActive
      ? 'text-accent'
      : 'text-text-secondary hover:text-text-primary'
  }`;

interface HeaderProps {
  searchRef: RefObject<HTMLInputElement>;
  onToggleSidebar: () => void;
}

export function Header({ searchRef, onToggleSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-primary/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-bg-tertiary md:hidden"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-5 w-5"
          >
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <Link
          to="/"
          className="flex shrink-0 items-center gap-2 text-sm font-semibold text-text-primary"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="h-5 w-5"
            aria-hidden
          >
            <path
              d="M16 3 L27 10 L24 27 L8 27 L5 10 Z"
              fill="var(--color-accent)"
              stroke="var(--color-accent-hover)"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          </svg>
          Dev Nuggets
        </Link>

        <nav
          aria-label="Primary"
          className="hidden shrink-0 items-center gap-0.5 sm:flex"
        >
          {PRIMARY_NAV.map((item) => (
            <NavLink key={item.to} to={item.to} className={navLinkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex flex-1 justify-end">
          <SearchBar ref={searchRef} />
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
