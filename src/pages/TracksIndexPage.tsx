import { TRACKS } from '@/content/tracks';
import { TrackCard } from '@/components/TrackCard';

/** `/tracks` — every reading track as a card, with progress and a link in. */
export function TracksIndexPage() {
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary">Tracks</h1>
        <p className="text-sm text-text-secondary">
          Ordered reading paths through the AI-engineering catalog — each one
          works through a topic guide by guide.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {TRACKS.map((track) => (
          <TrackCard key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
}
