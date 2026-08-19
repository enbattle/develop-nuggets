import { useMemo, useState } from 'react';
import type { Nugget } from '@/types';
import { ContentListItem } from './ContentListItem';

const PAGE_SIZE = 10;

interface PaginatedContentListProps {
  items: Nugget[];
  /** Accessible name for the tabpanel, and what "Load more" refers to. */
  label: string;
}

/**
 * Tag-filtered, alphabetically-sorted, paginated list — shared by the
 * Nuggets and Guides tabs on the home page so both get identical
 * filtering/pagination behavior instead of two hand-maintained copies.
 *
 * Render with `key={label}` (or similar) at the call site when switching
 * between item sets — that's what resets filter/pagination state on
 * switch, not an effect syncing state to the `items` prop.
 */
export function PaginatedContentList({ items, label }: PaginatedContentListProps) {
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const tags = useMemo(() => {
    const set = new Set<string>();
    items.forEach((item) => item.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, [items]);

  const filtered = useMemo(() => {
    const matches = selectedTag
      ? items.filter((item) => item.tags.includes(selectedTag))
      : items;
    return [...matches].sort((a, b) => a.title.localeCompare(b.title));
  }, [items, selectedTag]);

  const visible = filtered.slice(0, visibleCount);
  const remaining = filtered.length - visible.length;

  const selectTag = (tag: string | null) => {
    setSelectedTag(tag);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <section role="tabpanel" aria-label={label} className="flex flex-col gap-6">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => selectTag(null)}
            className={tagChipClass(selectedTag === null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => selectTag(tag)}
              className={tagChipClass(selectedTag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-sm text-text-tertiary">Nothing here yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((item) => (
            <li key={item.id}>
              <ContentListItem item={item} />
            </li>
          ))}
        </ul>
      )}

      {remaining > 0 && (
        <button
          type="button"
          onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          className="self-center rounded-md border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-bg-tertiary"
        >
          Load {Math.min(PAGE_SIZE, remaining)} more
        </button>
      )}
    </section>
  );
}

function tagChipClass(active: boolean): string {
  const base =
    'rounded-full border px-3 py-1 text-xs font-medium transition-colors';
  return active
    ? `${base} border-accent bg-accent/10 text-accent`
    : `${base} border-border text-text-secondary hover:bg-bg-tertiary`;
}
