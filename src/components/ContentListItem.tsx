import { Link } from 'react-router-dom';
import type { Nugget } from '@/types';
import { contentPath } from '@/content';
import { FORMAT_LABELS } from '@/lib/format';

interface ContentListItemProps {
  item: Nugget;
}

export function ContentListItem({ item }: ContentListItemProps) {
  return (
    <Link
      to={contentPath(item)}
      className="block rounded-lg border border-border bg-bg-primary p-4 transition-colors hover:border-accent"
    >
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-text-primary">
          {item.title}
        </h3>
        <span className="mt-0.5 shrink-0 rounded-full bg-bg-tertiary px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wide text-text-tertiary">
          {FORMAT_LABELS[item.format]}
        </span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
        {item.summary}
      </p>
      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-tertiary">
        {item.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-bg-tertiary px-2 py-0.5">
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
