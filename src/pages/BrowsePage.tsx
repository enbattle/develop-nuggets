import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Nugget, Tag } from '@/types';
import { CONTENT, contentBySection } from '@/content';
import { FORMAT_LABELS } from '@/lib/format';
import {
  DOMAIN_LABELS,
  DOMAIN_ORDER,
  SECTION_LABELS,
  sectionAnchorId,
  sectionDomain,
} from '@/lib/sections';
import { useDomain } from '@/hooks/useDomain';
import { SectionedContentList } from '@/components/SectionedContentList';
import { TagFilterMenu } from '@/components/TagFilterMenu';
import type { Density } from '@/components/ContentListItem';

type FormatFilter = 'all' | Nugget['format'];

const FORMAT_FILTERS: { id: FormatFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'nugget', label: `${FORMAT_LABELS.nugget}s` },
  { id: 'guide', label: `${FORMAT_LABELS.guide}s` },
];

const KNOWN_TAGS = new Set<Tag>(CONTENT.flatMap((item) => item.tags));

function segClass(active: boolean): string {
  const base =
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors';
  return active
    ? `${base} bg-accent/10 text-accent`
    : `${base} text-text-secondary hover:bg-bg-tertiary hover:text-text-primary`;
}

export function BrowsePage() {
  const [searchParams] = useSearchParams();
  const [domain, setDomain] = useDomain();
  const [format, setFormat] = useState<FormatFilter>('all');
  const [tags, setTags] = useState<Tag[]>(() =>
    searchParams.getAll('tag').filter((t): t is Tag => KNOWN_TAGS.has(t as Tag)),
  );
  const [density, setDensity] = useState<Density>('comfortable');

  // Seed the shared domain from `?domain=` once, so a hub card or a shared
  // link lands pre-filtered. After that, `useDomain` is the source of truth.
  const seeded = useRef(false);
  useEffect(() => {
    if (seeded.current) return;
    seeded.current = true;
    const param = searchParams.get('domain');
    if (param === 'systems' || param === 'ai') setDomain(param);
  }, [searchParams, setDomain]);

  const domainScoped = useMemo(
    () => CONTENT.filter((item) => sectionDomain(item.section) === domain),
    [domain],
  );

  const filtered = useMemo(
    () =>
      domainScoped.filter(
        (item) =>
          (format === 'all' || item.format === format) &&
          (tags.length === 0 || tags.some((tag) => item.tags.includes(tag))),
      ),
    [domainScoped, format, tags],
  );

  const groups = useMemo(() => contentBySection(filtered), [filtered]);

  if (CONTENT.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <h1 className="text-lg font-semibold text-text-primary">
          Nothing published yet
        </h1>
        <p className="mt-2 text-sm text-text-secondary">
          Check back soon — new nuggets are on the way.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="sr-only">Browse the catalog</h1>

      <div className="sticky top-16 z-30 flex flex-col gap-3 rounded-lg border border-border bg-bg-primary/95 p-3 backdrop-blur">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div role="group" aria-label="Filter by domain" className="flex gap-1">
            {DOMAIN_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                aria-pressed={domain === id}
                onClick={() => setDomain(id)}
                className={segClass(domain === id)}
              >
                {DOMAIN_LABELS[id]}
              </button>
            ))}
          </div>

          <div role="group" aria-label="Filter by format" className="flex gap-1">
            {FORMAT_FILTERS.map((option) => (
              <button
                key={option.id}
                type="button"
                aria-pressed={format === option.id}
                onClick={() => setFormat(option.id)}
                className={segClass(format === option.id)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <TagFilterMenu
            selected={tags}
            onChange={setTags}
            scope={domainScoped.filter(
              (item) => format === 'all' || item.format === format,
            )}
          />

          <div
            role="group"
            aria-label="List density"
            className="flex gap-1"
          >
            {(['comfortable', 'compact'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={density === mode}
                onClick={() => setDensity(mode)}
                className={segClass(density === mode)}
              >
                {mode === 'comfortable' ? 'Comfortable' : 'Compact'}
              </button>
            ))}
          </div>

          <p
            aria-live="polite"
            className="ml-auto text-sm text-text-tertiary"
          >
            {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
          </p>
        </div>

        {groups.length > 1 && (
          <nav
            aria-label="Jump to section"
            className="flex flex-wrap gap-1 border-t border-border pt-2"
          >
            {groups.map(({ section, items }) => (
              <button
                key={section}
                type="button"
                onClick={() =>
                  document
                    .getElementById(sectionAnchorId(section))
                    ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
                className="rounded px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-bg-tertiary hover:text-text-primary"
              >
                {SECTION_LABELS[section]}{' '}
                <span className="text-text-tertiary">{items.length}</span>
              </button>
            ))}
          </nav>
        )}
      </div>

      {tags.length > 0 && (
        <div
          role="group"
          aria-label="Active tag filters"
          className="flex flex-wrap items-center gap-2"
        >
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setTags(tags.filter((t) => t !== tag))}
              className="inline-flex items-center gap-1 rounded-full border border-accent bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-colors hover:bg-accent/20"
            >
              {tag}
              <span aria-hidden>×</span>
              <span className="sr-only">Remove {tag} filter</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => setTags([])}
            className="text-xs font-medium text-text-tertiary hover:text-text-secondary"
          >
            Clear all
          </button>
        </div>
      )}

      <div data-density={density}>
        <SectionedContentList items={filtered} density={density} />
      </div>
    </div>
  );
}
