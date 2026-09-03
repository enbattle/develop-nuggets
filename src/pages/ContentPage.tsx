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
  const {
    isComplete,
    markComplete,
    clearComplete,
    trackCompletion,
    isLastIncomplete,
  } = useTrackProgress();

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

  const completion = track ? trackCompletion(track) : null;
  const position = track ? track.items.indexOf(item.id) + 1 : 0;
  const remaining = completion ? completion.total - completion.done : 0;
  const trackFinished =
    !!completion && completion.total > 0 && completion.done === completion.total;
  const percent =
    completion && completion.total > 0
      ? Math.round((completion.done / completion.total) * 100)
      : 0;
  const lastOne = track ? isLastIncomplete(track, item.id) : false;

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

      {track && completion && (
        <section
          aria-label={`Track progress: ${track.title}`}
          className="flex flex-col gap-3 border-t border-border pt-6"
        >
          {trackFinished ? (
            <div className="flex flex-col gap-2 rounded-lg border border-accent bg-accent/10 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-accent">
                <span aria-hidden>✓</span> Track complete
              </p>
              <p className="text-sm text-text-secondary">
                You’ve finished{' '}
                <Link
                  to={`/tracks/${track.id}`}
                  className="font-medium text-accent hover:underline"
                >
                  {track.title}
                </Link>
                .
              </p>
              <Link
                to={`/tracks/${track.id}`}
                className="text-xs font-medium text-accent hover:underline"
              >
                Back to track overview →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 rounded-lg border border-border p-4">
              <div className="flex items-center justify-between gap-3 text-xs">
                <Link
                  to={`/tracks/${track.id}`}
                  className="font-medium text-text-secondary hover:text-accent hover:underline"
                >
                  {track.title}
                </Link>
                <span className="shrink-0 text-text-tertiary">
                  {position} of {completion.total}
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={completion.done}
                aria-valuemin={0}
                aria-valuemax={completion.total}
                aria-label={`${track.title} progress`}
                className="h-1.5 overflow-hidden rounded-full bg-bg-tertiary"
              >
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${percent}%` }}
                />
              </div>
              <p
                className={
                  remaining <= 2
                    ? 'text-sm font-semibold text-accent'
                    : 'text-xs text-text-tertiary'
                }
              >
                {remaining === 1 ? '1 left — last one' : `${remaining} left`}
              </p>
            </div>
          )}

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
            {done ? 'Completed ✓' : lastOne ? 'Finish track ✓' : 'Mark complete'}
          </button>
        </section>
      )}

      {(prev || next || track) && (
        <nav
          aria-label={pagerLabel}
          className="flex flex-col gap-3 border-t border-border pt-6 text-sm"
        >
          <div className="grid grid-cols-2 gap-3">
            {prev ? (
              <Link
                to={contentPath(prev)}
                className="flex min-h-[4rem] flex-col justify-center gap-1 rounded-md border border-border px-4 py-3 transition-colors hover:border-accent"
              >
                <span className="text-xs text-text-tertiary">
                  ← {track ? 'Previous in track' : 'Previous'}
                </span>
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
                className="flex min-h-[4rem] flex-col justify-center gap-1 rounded-md border border-border px-4 py-3 text-right transition-colors hover:border-accent"
              >
                <span className="text-xs text-text-tertiary">
                  {track ? 'Next in track' : 'Next'} →
                </span>
                <span className="font-medium text-text-primary">
                  {next.title}
                </span>
              </Link>
            ) : track ? (
              <Link
                to={`/tracks/${track.id}`}
                className="flex min-h-[4rem] flex-col justify-center gap-1 rounded-md border border-border px-4 py-3 text-right transition-colors hover:border-accent"
              >
                <span className="text-xs text-text-tertiary">
                  Track overview →
                </span>
                <span className="font-medium text-text-primary">
                  Back to {track.title}
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
