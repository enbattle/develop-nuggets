import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { NUGGETS } from '@/content/nuggets';
import { useLastViewedNugget } from '@/hooks/useContinueReading';
import { excerpt, formatDate } from '@/lib/text';

export function HomePage() {
  const lastViewed = useLastViewedNugget(NUGGETS);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const tags = useMemo(() => {
    const set = new Set<string>();
    NUGGETS.forEach((nugget) => nugget.tags.forEach((tag) => set.add(tag)));
    return Array.from(set).sort();
  }, []);

  const visible = useMemo(() => {
    const filtered = selectedTag
      ? NUGGETS.filter((nugget) => nugget.tags.includes(selectedTag))
      : NUGGETS;
    return [...filtered].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }, [selectedTag]);

  if (NUGGETS.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <h1 className="text-lg font-semibold text-text-primary">
          Nothing published yet
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Check back soon — new nuggets are on the way.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {lastViewed && (
        <Link
          to={`/nuggets/${lastViewed.id}`}
          className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm transition-colors hover:border-accent"
        >
          <span className="text-text-secondary">
            Continue reading{' '}
            <span className="font-medium text-text-primary">
              {lastViewed.title}
            </span>
          </span>
          <span aria-hidden className="text-accent">
            →
          </span>
        </Link>
      )}

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedTag(null)}
            className={tagChipClass(selectedTag === null)}
          >
            All
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setSelectedTag(tag)}
              className={tagChipClass(selectedTag === tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      <ul className="flex flex-col gap-3">
        {visible.map((nugget) => (
          <li key={nugget.id}>
            <Link
              to={`/nuggets/${nugget.id}`}
              className="block rounded-lg border border-border bg-bg-primary p-4 transition-colors hover:border-accent"
            >
              <h2 className="text-base font-semibold text-text-primary">
                {nugget.title}
              </h2>
              {nugget.body.trim() && (
                <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
                  {excerpt(nugget.body)}
                </p>
              )}
              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
                <time dateTime={nugget.updatedAt}>
                  {formatDate(nugget.updatedAt)}
                </time>
                {nugget.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-bg-tertiary px-2 py-0.5"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function tagChipClass(active: boolean): string {
  const base =
    'rounded-full border px-3 py-1 text-xs font-medium transition-colors';
  return active
    ? `${base} border-accent bg-accent/10 text-accent`
    : `${base} border-border text-text-secondary hover:bg-bg-tertiary`;
}
