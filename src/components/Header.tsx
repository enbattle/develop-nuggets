import { Link } from 'react-router-dom';
import type { RefObject } from 'react';
import { SearchBar } from './SearchBar';
import { ThemeToggle } from './ThemeToggle';

interface HeaderProps {
  searchRef: RefObject<HTMLInputElement>;
}

export function Header({ searchRef }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg-primary/95 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-3">
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

        <div className="flex-1">
          <SearchBar ref={searchRef} />
        </div>

        <ThemeToggle />
      </div>
    </header>
  );
}
