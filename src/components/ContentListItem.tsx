import { Link } from 'react-router-dom';
import type { Nugget } from '@/types';
import { contentPath } from '@/content';
import { FORMAT_LABELS } from '@/lib/format';

export type Density = 'comfortable' | 'compact';

interface ContentListItemProps {
  item: Nugget;
  /** `compact` tightens padding and hides the summary + tag row (Tesler). */
  density?: Density;
}

export function ContentListItem({
  item,
  density = 'comfortable',
}: ContentListItemProps) {
  const compact = density === 'compact';
  return (
    <Link
      to={contentPath(item)}
      className={`block rounded-lg border border-border bg-bg-primary transition-colors hover:border-accent ${
        compact ? 'p-2.5' : 'p-4'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className={`font-semibold text-text-primary ${
            compact ? 'text-sm' : 'text-base'
          }`}
        >
          {item.title}
        </h3>
        <span className="mt-0.5 shrink-0 rounded-full bg-bg-tertiary px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-text-tertiary">
          {FORMAT_LABELS[item.format]}
        </span>
      </div>
      {!compact && (
        <>
          <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
            {item.summary}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-bg-tertiary px-2 py-0.5"
              >
                {tag}
              </span>
            ))}
          </div>
        </>
      )}
    </Link>
  );
}
