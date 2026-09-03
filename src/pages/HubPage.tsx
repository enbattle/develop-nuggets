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
import { SearchBar } from '@/components/SearchBar';

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
  const showResumeCard = Boolean(lastViewed) || showResumeTrack;

  const openDomain = (domain: Domain) => {
    setDomain(domain);
    navigate('/browse');
  };

  return (
    <div className="flex flex-col gap-12">
      <section className="flex flex-col items-center gap-4 pt-4 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Dev Nuggets</h1>
        <p className="max-w-xl text-sm text-text-secondary">
          A searchable reference of short write-ups on backend systems and AI
          engineering — patterns and gotchas as nuggets, primers and
          checklists as guides.
        </p>
        <SearchBar className="max-w-xl" />
      </section>

      {showResumeCard && (
        <section
          aria-label="Pick up where you left off"
          className="flex flex-col gap-3 rounded-lg border border-accent bg-accent/5 p-4"
        >
          {lastViewed && (
            <Link
              to={contentPath(lastViewed)}
              className="flex items-center justify-between gap-3 text-sm"
            >
              <span className="text-text-secondary">
                Continue reading{' '}
                <span className="font-semibold text-text-primary">
                  {lastViewed.title}
                </span>
              </span>
              <span aria-hidden className="text-accent">
                →
              </span>
            </Link>
          )}

          {showResumeTrack && resumeItem && resumeTrack && resumeProgress && (
            <Link
              to={contentPath(resumeItem)}
              className="flex flex-col gap-2 border-t border-accent/20 pt-3 first:border-t-0 first:pt-0"
            >
              <span className="flex items-center justify-between gap-3 text-sm">
                <span className="text-text-secondary">
                  Resume{' '}
                  <span className="font-semibold text-text-primary">
                    {resumeTrack.title}
                  </span>{' '}
                  — {resumeProgress.done}/{resumeProgress.total}
                </span>
                <span aria-hidden className="text-accent">
                  →
                </span>
              </span>
              <span
                role="progressbar"
                aria-valuenow={resumeProgress.done}
                aria-valuemin={0}
                aria-valuemax={resumeProgress.total}
                aria-label={`${resumeTrack.title} progress`}
                className="block h-1.5 overflow-hidden rounded-full bg-bg-tertiary"
              >
                <span
                  className="block h-full rounded-full bg-accent transition-all"
                  style={{
                    width: `${
                      resumeProgress.total > 0
                        ? Math.round(
                            (resumeProgress.done / resumeProgress.total) * 100,
                          )
                        : 0
                    }%`,
                  }}
                />
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
