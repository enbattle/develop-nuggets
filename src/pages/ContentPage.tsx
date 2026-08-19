import { Link, useParams } from 'react-router-dom';
import { CONTENT, contentPath, getContent } from '@/content';
import { useRecordReadingProgress } from '@/hooks/useContinueReading';
import { LazyMarkdownRenderer } from '@/components/LazyMarkdownRenderer';
import { getRelatedNuggets } from '@/lib/related';

export function ContentPage() {
  const { id } = useParams<{ id: string }>();
  const item = id ? getContent(id) : undefined;
  useRecordReadingProgress(item?.id);

  if (!item) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-text-secondary">Content not found.</p>
      </div>
    );
  }

  const related = getRelatedNuggets(item, CONTENT);

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold text-text-primary">{item.title}</h1>

        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-bg-tertiary px-2 py-0.5 text-xs text-text-tertiary"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <LazyMarkdownRenderer content={item.body} />

      {related.length > 0 && (
        <footer className="flex flex-col gap-3 border-t border-border pt-6">
          <h2 className="text-sm font-semibold text-text-primary">Related</h2>
          <ul className="flex flex-col gap-2">
            {related.map((relatedItem) => (
              <li key={relatedItem.id}>
                <Link
                  to={contentPath(relatedItem)}
                  className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-accent"
                >
                  <span className="font-medium text-text-primary">
                    {relatedItem.title}
                  </span>
                  <span className="text-xs text-text-tertiary">
                    {relatedItem.tags.join(', ')}
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
