import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { contentPath, getContent } from '@/content';
import { getTrack } from '@/content/tracks';
import { trackProgress, useTrackProgress } from '@/lib/trackProgress';

export function TrackPage() {
  const { id } = useParams<{ id: string }>();
  const track = id ? getTrack(id) : undefined;
  const { isComplete, trackCompletion } = useTrackProgress();

  useEffect(() => {
    if (track) trackProgress.setLastTrackId(track.id);
  }, [track]);

  if (!track) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-text-secondary">Track not found.</p>
      </div>
    );
  }

  const { done, total } = trackCompletion(track);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  const rows = track.items.map((itemId) => ({
    itemId,
    item: getContent(itemId),
  }));
  const resolvable = rows.filter((row) => row.item);
  const startTarget =
    resolvable.find((row) => !isComplete(row.itemId))?.item ??
    resolvable[0]?.item ??
    null;

  return (
    <article className="flex flex-col gap-6">
      <header className="flex flex-col gap-3">
        <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
          Track
        </p>
        <h1 className="text-2xl font-bold text-text-primary">{track.title}</h1>
        <p className="text-sm text-text-secondary">{track.summary}</p>
      </header>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <span>
            {done} of {total} complete
          </span>
          <span>{percent}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${track.title} progress`}
          className="h-2 overflow-hidden rounded-full bg-bg-tertiary"
        >
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {startTarget && (
        <Link
          to={contentPath(startTarget)}
          className="self-start rounded-md border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-accent"
        >
          {done > 0 ? 'Resume' : 'Start'} →
        </Link>
      )}

      {rows.length === 0 ? (
        <p className="text-sm text-text-tertiary">
          This track has no items yet — check back soon.
        </p>
      ) : (
        <ol className="flex flex-col gap-2">
          {rows.map(({ itemId, item }, index) => {
            if (!item) {
              return (
                <li
                  key={itemId}
                  aria-disabled="true"
                  className="flex items-center gap-3 rounded-md border border-dashed border-border px-3 py-2 text-sm text-text-tertiary"
                >
                  <span className="w-5 shrink-0 text-center">{index + 1}</span>
                  <span className="flex-1">Coming soon</span>
                </li>
              );
            }
            const complete = isComplete(itemId);
            return (
              <li key={itemId}>
                <Link
                  to={contentPath(item)}
                  className="flex items-center gap-3 rounded-md border border-border px-3 py-2 text-sm transition-colors hover:border-accent"
                >
                  <span
                    aria-hidden
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                      complete
                        ? 'border-accent bg-accent text-bg-primary'
                        : 'border-border text-text-tertiary'
                    }`}
                  >
                    {complete ? '✓' : index + 1}
                  </span>
                  <span className="flex-1 font-medium text-text-primary">
                    {item.title}
                  </span>
                  {complete && <span className="sr-only">completed</span>}
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </article>
  );
}
