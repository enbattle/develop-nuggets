import { Link } from 'react-router-dom';
import type { Nugget } from '@/types';
import { contentPath } from '@/content';
import { excerpt } from '@/lib/text';

interface ContentListItemProps {
  item: Nugget;
}

export function ContentListItem({ item }: ContentListItemProps) {
  return (
    <Link
      to={contentPath(item)}
      className="block rounded-lg border border-border bg-bg-primary p-4 transition-colors hover:border-accent"
    >
      <h3 className="text-base font-semibold text-text-primary">
        {item.title}
      </h3>
      {item.body.trim() && (
        <p className="mt-1 line-clamp-2 text-sm text-text-secondary">
          {excerpt(item.body)}
        </p>
      )}
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
