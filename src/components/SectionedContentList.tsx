import type { Nugget } from '@/types';
import { contentBySection } from '@/content';
import { SECTION_LABELS, SECTION_DESCRIPTIONS } from '@/lib/sections';
import { ContentListItem } from './ContentListItem';

interface SectionedContentListProps {
  /** Already filtered by the caller — this component only groups and renders. */
  items: Nugget[];
}

/**
 * The home page body: `items` grouped into topic sections (in `SECTION_ORDER`,
 * guides before nuggets within each), each under its heading and one-line
 * charter. Empty sections are dropped by `contentBySection`; if nothing is
 * left, an empty-state line is shown instead.
 */
export function SectionedContentList({ items }: SectionedContentListProps) {
  const groups = contentBySection(items);

  if (groups.length === 0) {
    return (
      <p className="text-sm text-text-tertiary">Nothing matches that filter.</p>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {groups.map(({ section, items }) => (
        <section key={section} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-lg font-semibold text-text-primary">
              {SECTION_LABELS[section]}
            </h2>
            <p className="text-sm text-text-secondary">
              {SECTION_DESCRIPTIONS[section]}
            </p>
          </div>
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <li key={item.id}>
                <ContentListItem item={item} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
