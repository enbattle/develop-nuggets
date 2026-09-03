import { useState } from 'react';
import { CodeBlock } from '@/components/CodeBlock';

export interface CodeTab {
  label: string;
  lang: string;
  source: string;
}

/**
 * A small tabbed wrapper around the repo's Shiki `CodeBlock`. One tab renders
 * as just the block; several render a `role="tablist"` above it.
 */
export function CodeTabs({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = useState(0);
  if (tabs.length === 0) return null;
  const current = tabs[Math.min(active, tabs.length - 1)];

  return (
    <div className="flex flex-col gap-2">
      {tabs.length > 1 && (
        <div role="tablist" aria-label="Implementation" className="flex flex-wrap gap-1">
          {tabs.map((tab, i) => (
            <button
              key={tab.label}
              type="button"
              role="tab"
              aria-selected={i === active}
              onClick={() => setActive(i)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                i === active
                  ? 'bg-accent/10 text-accent'
                  : 'text-text-tertiary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}
      <div role="tabpanel">
        <CodeBlock code={current.source} language={current.lang} />
      </div>
    </div>
  );
}
