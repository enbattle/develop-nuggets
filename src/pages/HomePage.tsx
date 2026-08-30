import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import type { Nugget, Tag } from '@/types';
import { CONTENT, contentPath } from '@/content';
import { FORMAT_LABELS } from '@/lib/format';
import { useLastViewedNugget } from '@/hooks/useContinueReading';
import { SectionedContentList } from '@/components/SectionedContentList';

type FormatFilter = 'all' | Nugget['format'];

const FORMAT_FILTERS: { id: FormatFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'nugget', label: `${FORMAT_LABELS.nugget}s` },
  { id: 'guide', label: `${FORMAT_LABELS.guide}s` },
];

const ALL_TAGS: Tag[] = Array.from(
  new Set(CONTENT.flatMap((item) => item.tags)),
).sort();

export function HomePage() {
  const lastViewed = useLastViewedNugget(CONTENT);
  const [format, setFormat] = useState<FormatFilter>('all');
  const [tag, setTag] = useState<Tag | null>(null);

  const filtered = useMemo(
    () =>
      CONTENT.filter(
        (item) =>
          (format === 'all' || item.format === format) &&
          (tag === null || item.tags.includes(tag)),
      ),
    [format, tag],
  );

  if (CONTENT.length === 0) {
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
          to={contentPath(lastViewed)}
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

      <div className="flex flex-col gap-3">
        <div
          role="group"
          aria-label="Filter by format"
          className="flex gap-4 border-b border-border"
        >
          {FORMAT_FILTERS.map((option) => (
            <button
              key={option.id}
              type="button"
              aria-pressed={format === option.id}
              onClick={() => setFormat(option.id)}
              className={formatFilterClass(format === option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTag(null)}
            className={tagChipClass(tag === null)}
          >
            All topics
          </button>
          {ALL_TAGS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setTag(option)}
              className={tagChipClass(tag === option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <SectionedContentList items={filtered} />
    </div>
  );
}

function formatFilterClass(active: boolean): string {
  const base =
    '-mb-px border-b-2 px-1 py-2 text-sm font-medium transition-colors';
  return active
    ? `${base} border-accent text-accent`
    : `${base} border-transparent text-text-secondary hover:text-text-primary`;
}

function tagChipClass(active: boolean): string {
  const base =
    'rounded-full border px-3 py-1 text-xs font-medium transition-colors';
  return active
    ? `${base} border-accent bg-accent/10 text-accent`
    : `${base} border-border text-text-secondary hover:bg-bg-tertiary`;
}
