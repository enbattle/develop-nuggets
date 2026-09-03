import { Link } from 'react-router-dom';
import type { Track } from '@/content/tracks';
import { useTrackProgress } from '@/lib/trackProgress';

interface TrackCardProps {
  track: Track;
}

/**
 * One track as a clickable card — title, item count, and a progress bar fed
 * by `trackProgress`. Shared by the hub's tracks row and `TracksIndexPage`.
 */
export function TrackCard({ track }: TrackCardProps) {
  const { trackCompletion } = useTrackProgress();
  const { done, total } = trackCompletion(track);
  const percent = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <Link
      to={`/tracks/${track.id}`}
      className="flex flex-col gap-3 rounded-lg border border-border bg-bg-primary p-4 transition-colors hover:border-accent"
    >
      <div className="flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-text-primary">
          {track.title}
        </h3>
        <p className="text-xs text-text-tertiary">
          {total} {total === 1 ? 'item' : 'items'}
          {done > 0 && ` · ${done} done`}
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <div
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label={`${track.title} progress`}
          className="h-1.5 overflow-hidden rounded-full bg-bg-tertiary"
        >
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
