import { Link, useNavigate } from 'react-router-dom';
import { CONTENT, contentPath } from '@/content';
import { curatedItems } from '@/content/curated';
import { TRACKS, getTrack } from '@/content/tracks';
import {
  DOMAIN_LABELS,
  DOMAIN_ORDER,
  SECTION_LABELS,
  SECTION_ORDER,
  sectionDomain,
  type Domain,
} from '@/lib/sections';
import { useDomain } from '@/hooks/useDomain';
import { useLastViewedNugget, useResumeTrack } from '@/hooks/useContinueReading';
import { trackProgress, useTrackProgress } from '@/lib/trackProgress';
import { TrackCard } from '@/components/TrackCard';

interface DomainCard {
  domain: Domain;
  itemCount: number;
  sections: string[];
  topSections: string[];
  trackCount: number;
}

const DOMAIN_CARDS: DomainCard[] = DOMAIN_ORDER.map((domain) => {
  const items = CONTENT.filter((item) => sectionDomain(item.section) === domain);
  const sections = SECTION_ORDER.filter(
    (section) =>
      sectionDomain(section) === domain &&
      items.some((item) => item.section === section),
  );
  return {
    domain,
    itemCount: items.length,
    sections: sections.map((section) => SECTION_LABELS[section]),
    topSections: sections.slice(0, 4).map((section) => SECTION_LABELS[section]),
    trackCount: TRACKS.filter((track) => sectionDomain(track.section) === domain)
      .length,
  };
});

const CURATED_ITEMS = curatedItems();

// Each resume entry is its own bordered, hoverable target (Law of Common
// Region + Fitts) — not two links sharing a divider — so it's unambiguous
// which one you're clicking when both show.
const resumeRowClass =
  'flex items-start gap-3 rounded-md border border-border bg-bg-primary p-3 transition-colors hover:border-accent';
const resumeEyebrowClass =
  'block text-[0.7rem] font-medium uppercase tracking-wide text-text-tertiary';

const iconClass = 'mt-0.5 h-4 w-4 shrink-0 text-text-tertiary';

/** A page — "continue reading" a single item. */
function ReadingIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 4a2 2 0 0 1 2-2h8l5 5v13a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z" />
      <path d="M15 2v5h5" />
      <path d="M9 12h7M9 16h7" />
    </svg>
  );
}

/** A path between stops — "resume" an ordered track. */
function TrackIcon() {
  return (
    <svg
      className={iconClass}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M6 8.5v4a3 3 0 0 0 3 3h6" strokeDasharray="0.1 3.4" />
    </svg>
  );
}

export function HubPage() {
  const navigate = useNavigate();
  const [, setDomain] = useDomain();

  const lastViewed = useLastViewedNugget(CONTENT);
  const resumeItem = useResumeTrack();
  useTrackProgress(); // re-render when completion changes
  const lastTrackId = trackProgress.getLastTrackId();
  const resumeTrack = lastTrackId ? getTrack(lastTrackId) : undefined;
  const resumeProgress = resumeTrack
    ? trackProgress.trackCompletion(resumeTrack)
    : null;
  const showResumeTrack = Boolean(resumeItem && resumeTrack && resumeProgress);
  // Don't also show a standalone "Continue reading" row when the last item
  // read is part of the track we're already offering to resume — that's the
  // same reading thread, and the track row is the richer view of it.
  const lastViewedInResumeTrack = Boolean(
    showResumeTrack && lastViewed && resumeTrack?.items.includes(lastViewed.id),
  );
  const showContinueReading = Boolean(lastViewed) && !lastViewedInResumeTrack;
  const showResumeCard = showContinueReading || showResumeTrack;

  const openDomain = (domain: Domain) => {
    setDomain(domain);
    navigate('/browse');
  };

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-3 pt-4 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Dev Nuggets</h1>
        <p className="max-w-xl text-sm text-text-secondary">
          A searchable reference of short write-ups on backend systems and AI
          engineering — patterns and gotchas as nuggets, primers and
          checklists as guides. Search from the bar above, or press{' '}
          <kbd className="rounded border border-border bg-bg-secondary px-1 text-xs">
            Ctrl
          </kbd>
          /
          <kbd className="rounded border border-border bg-bg-secondary px-1 text-xs">
            ⌘
          </kbd>
          <kbd className="rounded border border-border bg-bg-secondary px-1 text-xs">
            K
          </kbd>
          .
        </p>
      </section>

      {showResumeCard && (
        <section
          aria-label="Pick up where you left off"
          className="flex flex-col gap-2 rounded-lg border border-border bg-bg-secondary p-3"
        >
          {showContinueReading && lastViewed && (
            <Link to={contentPath(lastViewed)} className={resumeRowClass}>
              <ReadingIcon />
              <span className="min-w-0 flex-1">
                <span className={resumeEyebrowClass}>Continue reading</span>
                <span className="block truncate font-semibold text-text-primary">
                  {lastViewed.title}
                </span>
                <span className="block text-xs text-text-tertiary">
                  {SECTION_LABELS[lastViewed.section]}
                </span>
              </span>
              <span aria-hidden className="self-center text-accent">
                →
              </span>
            </Link>
          )}

          {showResumeTrack && resumeItem && resumeTrack && resumeProgress && (
            <Link to={contentPath(resumeItem)} className={resumeRowClass}>
              <TrackIcon />
              <span className="min-w-0 flex-1">
                <span className={resumeEyebrowClass}>Resume track</span>
                <span className="block truncate font-semibold text-text-primary">
                  {resumeTrack.title}
                </span>
                <span className="mt-1.5 flex items-center gap-2">
                  <span
                    role="progressbar"
                    aria-valuenow={resumeProgress.done}
                    aria-valuemin={0}
                    aria-valuemax={resumeProgress.total}
                    aria-label={`${resumeTrack.title} progress`}
                    className="block h-1.5 flex-1 overflow-hidden rounded-full bg-bg-tertiary"
                  >
                    <span
                      className="block h-full rounded-full bg-accent transition-all"
                      style={{
                        width: `${
                          resumeProgress.total > 0
                            ? Math.round(
                                (resumeProgress.done / resumeProgress.total) *
                                  100,
                              )
                            : 0
                        }%`,
                      }}
                    />
                  </span>
                  <span className="shrink-0 text-xs text-text-tertiary">
                    {resumeProgress.done} of {resumeProgress.total}
                  </span>
                </span>
              </span>
              <span aria-hidden className="self-center text-accent">
                →
              </span>
            </Link>
          )}
        </section>
      )}

      <section aria-label="Browse by domain" className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-text-primary">
          Browse by domain
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {DOMAIN_CARDS.map((card) => (
            <button
              key={card.domain}
              type="button"
              onClick={() => openDomain(card.domain)}
              className="flex flex-col gap-2 rounded-lg border border-border bg-bg-primary p-5 text-left transition-colors hover:border-accent"
            >
              <span className="text-base font-semibold text-text-primary">
                {DOMAIN_LABELS[card.domain]}
              </span>
              <span className="text-xs text-text-tertiary">
                {card.itemCount} items ·{' '}
                {card.domain === 'ai'
                  ? `${card.trackCount} tracks`
                  : `${card.sections.length} topics`}
              </span>
              <span className="mt-1 text-sm text-text-secondary">
                {card.topSections.join(' · ')}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-lg font-semibold text-text-primary">Tracks</h2>
          <Link
            to="/tracks"
            className="text-sm font-medium text-accent hover:underline"
          >
            See all
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TRACKS.map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold text-text-primary">Start here</h2>
        <ul className="flex flex-col gap-2">
          {CURATED_ITEMS.map((item) => (
            <li key={item.id}>
              <Link
                to={contentPath(item)}
                className="block rounded-lg border border-border bg-bg-primary p-3 transition-colors hover:border-accent"
              >
                <span className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-text-primary">
                    {item.title}
                  </span>
                  <span className="shrink-0 text-[0.7rem] uppercase tracking-wide text-text-tertiary">
                    {SECTION_LABELS[item.section]}
                  </span>
                </span>
                <span className="mt-1 block text-sm text-text-secondary">
                  {item.summary}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
