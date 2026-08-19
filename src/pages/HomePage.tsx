import { Link } from 'react-router-dom';
import { useState } from 'react';
import { NUGGETS } from '@/content/nuggets';
import { GUIDES } from '@/content/guides';
import { CONTENT, contentPath } from '@/content';
import { useLastViewedNugget } from '@/hooks/useContinueReading';
import { PaginatedContentList } from '@/components/PaginatedContentList';

type Tab = 'nuggets' | 'guides';

const TABS: { id: Tab; label: string }[] = [
  { id: 'guides', label: 'Guides' },
  { id: 'nuggets', label: 'Nuggets' },
];

export function HomePage() {
  const lastViewed = useLastViewedNugget(CONTENT);
  const [activeTab, setActiveTab] = useState<Tab>('guides');

  if (NUGGETS.length === 0 && GUIDES.length === 0) {
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
      {lastViewed && (
        <Link
          to={contentPath(lastViewed)}
          className="flex items-center justify-between rounded-lg border border-border bg-bg-secondary px-4 py-3 text-sm transition-colors hover:border-accent"
        >
          <span className="text-text-secondary">
            Continue reading{' '}
            <span className="font-medium text-text-primary">
              {lastViewed.title}
            </span>
          </span>
          <span aria-hidden className="text-accent">
            →
          </span>
        </Link>
      )}

      <div
        role="tablist"
        aria-label="Content type"
        className="flex gap-4 border-b border-border"
      >
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={tabClass(activeTab === tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'nuggets' ? (
        <PaginatedContentList key="nuggets" items={NUGGETS} label="Nuggets" />
      ) : (
        <PaginatedContentList key="guides" items={GUIDES} label="Guides" />
      )}
    </div>
  );
}

function tabClass(active: boolean): string {
  const base = '-mb-px border-b-2 px-1 py-2 text-sm font-medium transition-colors';
  return active
    ? `${base} border-accent text-accent`
    : `${base} border-transparent text-text-secondary hover:text-text-primary`;
}
