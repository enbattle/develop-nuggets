import { Link, useParams } from 'react-router-dom';
import { NUGGETS, getNugget } from '@/content/nuggets';
import { useRecordReadingProgress } from '@/hooks/useContinueReading';
import { LazyMarkdownRenderer } from '@/components/LazyMarkdownRenderer';
import { getRelatedNuggets } from '@/lib/related';
import { formatDate } from '@/lib/text';

export function NuggetPage() {
  const { id } = useParams<{ id: string }>();
  const nugget = id ? getNugget(id) : undefined;
  useRecordReadingProgress(nugget?.id);

  if (!nugget) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-text-secondary">Nugget not found.</p>
      </div>
    );
  }

  const related = getRelatedNuggets(nugget, NUGGETS);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-text-primary">{nugget.title}</h1>

        {nugget.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {nugget.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-tertiary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <p className="text-xs text-text-tertiary">
          Updated {formatDate(nugget.updatedAt)}
        </p>
      </header>

      <LazyMarkdownRenderer content={nugget.body} />

      {related.length > 0 && (
        <footer className="flex flex-col gap-3 border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-text-primary">Related</h2>
          <ul className="flex flex-col gap-2">
            {related.map((relatedNugget) => (
              <li key={relatedNugget.id}>
                <Link
                  to={`/nuggets/${relatedNugget.id}`}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-accent"
                >
                  <span className="font-medium text-text-primary">
                    {relatedNugget.title}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {relatedNugget.tags.join(', ')}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </footer>
      )}
    </article>
  );
}
