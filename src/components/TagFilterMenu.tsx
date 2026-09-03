import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { Nugget, Tag } from '@/types';
import { CONTENT } from '@/content';

interface TagFilterMenuProps {
  /** Currently-checked tags. */
  selected: Tag[];
  /** Called with the next selection whenever a tag is toggled. OR semantics. */
  onChange: (next: Tag[]) => void;
  /**
   * Items the surrounding view is currently showing (domain/format scope), used
   * only for the per-tag counts. Defaults to the whole catalogue.
   */
  scope?: Nugget[];
}

const ALL_TAGS: Tag[] = Array.from(
  new Set(CONTENT.flatMap((item) => item.tags)),
).sort();

/**
 * Collapses the full tag vocabulary (~25 values) behind one trigger button
 * (Hick's Law): a popover with a search field and a scrollable checkbox list.
 * Multi-select, OR semantics. Closes on Escape or an outside click.
 */
export function TagFilterMenu({
  selected,
  onChange,
  scope = CONTENT,
}: TagFilterMenuProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const dialogId = useId();

  const counts = useMemo(() => {
    const map = new Map<Tag, number>();
    for (const tag of ALL_TAGS) {
      map.set(tag, scope.filter((item) => item.tags.includes(tag)).length);
    }
    return map;
  }, [scope]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? ALL_TAGS.filter((tag) => tag.includes(q)) : ALL_TAGS;
  }, [query]);

  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const toggle = (tag: Tag) => {
    onChange(
      selected.includes(tag)
        ? selected.filter((value) => value !== tag)
        : [...selected, tag],
    );
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={open ? dialogId : undefined}
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
      >
        Tags
        {selected.length > 0 && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-accent/10 px-1.5 text-xs font-semibold text-accent">
            {selected.length}
          </span>
        )}
      </button>

      {open && (
        <div
          id={dialogId}
          role="dialog"
          aria-label="Filter by tag"
          className="absolute left-0 top-full z-40 mt-1 flex w-64 flex-col gap-2 rounded-md border border-border bg-bg-primary p-2 shadow-lg"
        >
          <input
            ref={searchRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Filter tags…"
            aria-label="Filter tags"
            className="w-full rounded-md border border-border bg-bg-secondary px-2 py-1 text-sm text-text-primary placeholder:text-text-tertiary focus:border-accent focus:outline-none"
          />

          <div className="flex items-center justify-between px-1 text-xs text-text-tertiary">
            <span>
              {selected.length > 0
                ? `${selected.length} selected`
                : 'None selected'}
            </span>
            {selected.length > 0 && (
              <button
                type="button"
                onClick={() => onChange([])}
                className="font-medium text-accent hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <ul className="flex max-h-60 flex-col overflow-y-auto">
            {visible.length === 0 ? (
              <li className="px-1 py-2 text-sm text-text-tertiary">
                No tags match.
              </li>
            ) : (
              visible.map((tag) => (
                <li key={tag}>
                  <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-sm text-text-secondary hover:bg-bg-tertiary">
                    <input
                      type="checkbox"
                      aria-label={tag}
                      checked={selected.includes(tag)}
                      onChange={() => toggle(tag)}
                      className="accent-accent"
                    />
                    <span className="flex-1 text-text-primary">{tag}</span>
                    <span aria-hidden className="text-xs text-text-tertiary">
                      {counts.get(tag) ?? 0}
                    </span>
                  </label>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
