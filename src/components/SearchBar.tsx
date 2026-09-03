import { forwardRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Nugget } from '@/types';
import { CONTENT, contentPath } from '@/content';
import { searchNuggets } from '@/lib/search';
import { FORMAT_LABELS } from '@/lib/format';
import { SECTION_LABELS } from '@/lib/sections';

interface SearchBarProps {
  /** Overrides the default `max-w-sm` width cap on the wrapper. */
  className?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  function SearchBar({ className }, ref) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const results = useMemo(
      () => (query.trim() ? searchNuggets(CONTENT, query).slice(0, 8) : []),
      [query],
    );

    const goTo = (item: Nugget) => {
      navigate(contentPath(item));
      setQuery('');
      setOpen(false);
    };

    return (
      <div className={`relative w-full ${className ?? 'max-w-sm'}`}>
        <input
          ref={ref}
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 100)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' && results[0]) goTo(results[0]);
            if (event.key === 'Escape') {
              setQuery('');
              setOpen(false);
              event.currentTarget.blur();
            }
          }}
          placeholder="Search… (Ctrl+K)"
          aria-label="Search content"
          className="w-full rounded-md border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
        />
        {open && query.trim() && (
          <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-bg-primary shadow-lg">
            {results.length === 0 ? (
              <p className="px-3 py-2 text-sm text-text-tertiary">
                No matches.
              </p>
            ) : (
              results.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onMouseDown={() => goTo(item)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-bg-tertiary"
                >
                  <span className="flex items-center gap-2">
                    <span className="font-medium text-text-primary">
                      {item.title}
                    </span>
                    <span className="rounded-full bg-accent/10 px-1.5 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-accent">
                      {FORMAT_LABELS[item.format]}
                    </span>
                  </span>
                  <span className="mt-0.5 line-clamp-1 text-xs text-text-secondary">
                    {item.summary}
                  </span>
                  <span className="block text-[0.7rem] uppercase tracking-wide text-text-tertiary">
                    {SECTION_LABELS[item.section]}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  },
);
