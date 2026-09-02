import { Link, useParams } from 'react-router-dom';
import {
  CONTENT,
  contentPath,
  getContent,
  sectionNeighbors,
  trackNeighbors,
} from '@/content';
import { trackForItem } from '@/content/tracks';
import { SECTION_LABELS } from '@/lib/sections';
import { extractHeadings } from '@/lib/slug';
import { useTrackProgress } from '@/lib/trackProgress';
import { useRecordReadingProgress } from '@/hooks/useContinueReading';
import { LazyMarkdownRenderer } from '@/components/LazyMarkdownRenderer';
import { TableOfContents } from '@/components/TableOfContents';
import { getRelatedNuggets } from '@/lib/related';

export function ContentPage() {
  const { id } = useParams<{ id: string }>();
  const item = id ? getContent(id) : undefined;
  useRecordReadingProgress(item?.id);
  const { isComplete, markComplete, clearComplete } = useTrackProgress();

  if (!item) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-text-secondary">Content not found.</p>
      </div>
    );
  }

  const related = getRelatedNuggets(item, CONTENT);
  const track = trackForItem(item.id);
  const { prev, next } = track ? trackNeighbors(item) : sectionNeighbors(item);
  const sectionLabel = SECTION_LABELS[item.section];
  const pagerLabel = track
    ? `Track: ${track.title}`
    : `More in ${sectionLabel}`;
  const headings = extractHeadings(item.body);
  const done = track ? isComplete(item.id) : false;

  return (
    <article className="relative flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
          {sectionLabel}
        </p>
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

      {headings.length >= 3 && (
        <>
          <details className="rounded-md border border-border p-3 text-sm xl:hidden">
            <summary className="cursor-pointer font-medium text-text-primary">
              On this page
            </summary>
            <div className="mt-2">
              <TableOfContents headings={headings} />
            </div>
          </details>

          <aside className="pointer-events-none absolute left-full top-0 ml-8 hidden w-56 xl:block">
            <div className="pointer-events-auto sticky top-20">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </>
      )}

      <LazyMarkdownRenderer content={item.body} />

      {track && (
        <button
          type="button"
          onClick={() =>
            done ? clearComplete(item.id) : markComplete(item.id)
          }
          aria-pressed={done}
          className={`self-start rounded-md border px-3 py-1.5 text-xs font-medium transition-colors ${
            done
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border text-text-secondary hover:border-accent'
          }`}
        >
          {done ? 'Completed ✓' : 'Mark complete'}
        </button>
      )}

      {(prev || next) && (
        <nav
          aria-label={pagerLabel}
          className="flex flex-col gap-3 border-t border-border pt-6 text-sm"
        >
          {track && (
            <p className="text-xs text-text-tertiary">
              Track:{' '}
              <Link
                to={`/tracks/${track.id}`}
                className="font-medium text-accent hover:underline"
              >
                {track.title}
              </Link>
            </p>
          )}
          <div className="grid grid-cols-2 gap-3">
            {prev ? (
              <Link
                to={contentPath(prev)}
                className="flex flex-col gap-1 rounded-md border border-border px-3 py-2 transition-colors hover:border-accent"
              >
                <span className="text-xs text-text-tertiary">← Previous</span>
                <span className="font-medium text-text-primary">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={contentPath(next)}
                className="flex flex-col gap-1 rounded-md border border-border px-3 py-2 text-right transition-colors hover:border-accent"
              >
                <span className="text-xs text-text-tertiary">Next →</span>
                <span className="font-medium text-text-primary">
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </div>
        </nav>
      )}

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
