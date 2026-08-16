import { forwardRef, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NUGGETS } from '@/content/nuggets';
import { searchNuggets } from '@/lib/search';

export const SearchBar = forwardRef<HTMLInputElement>(
  function SearchBar(_props, ref) {
    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const navigate = useNavigate();

    const results = useMemo(
      () => (query.trim() ? searchNuggets(NUGGETS, query).slice(0, 8) : []),
      [query],
    );

    const goTo = (id: string) => {
      navigate(`/nuggets/${id}`);
      setQuery('');
      setOpen(false);
    };

    return (
      <div className="relative w-full max-w-sm">
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
            if (event.key === 'Enter' && results[0]) goTo(results[0].id);
            if (event.key === 'Escape') {
              setQuery('');
              setOpen(false);
              event.currentTarget.blur();
            }
          }}
          placeholder="Search nuggets… (Ctrl+K)"
          aria-label="Search nuggets"
          className="w-full rounded-md border border-border bg-bg-secondary px-3 py-1.5 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
        />
        {open && query.trim() && (
          <div className="absolute left-0 right-0 top-full z-40 mt-1 max-h-80 overflow-y-auto rounded-md border border-border bg-bg-primary shadow-lg">
            {results.length === 0 ? (
              <p className="px-3 py-2 text-sm text-text-tertiary">
                No matches.
              </p>
            ) : (
              results.map((nugget) => (
                <button
                  key={nugget.id}
                  type="button"
                  onMouseDown={() => goTo(nugget.id)}
                  className="block w-full px-3 py-2 text-left text-sm hover:bg-bg-tertiary"
                >
                  <span className="block font-medium text-text-primary">
                    {nugget.title}
                  </span>
                  {nugget.tags.length > 0 && (
                    <span className="text-xs text-text-tertiary">
                      {nugget.tags.join(', ')}
                    </span>
                  )}
                </button>
              ))
            )}
          </div>
        )}
      </div>
    );
  },
);
