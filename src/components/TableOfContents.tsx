import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/slug';

interface TableOfContentsProps {
  headings: Heading[];
}

/**
 * "On this page" anchor list for a content body. `h3`s sit indented under
 * their `h2`s. The heading nearest the top of the viewport is marked
 * `aria-current` via an `IntersectionObserver` on the rendered anchors.
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onscreen = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (onscreen[0]) setActiveId(onscreen[0].target.id);
      },
      { rootMargin: '0px 0px -70% 0px' },
    );

    for (const { id } of headings) {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav aria-label="On this page" className="text-sm">
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => {
          const active = heading.id === activeId;
          return (
            <li
              key={heading.id}
              className={heading.depth === 3 ? 'pl-3' : undefined}
            >
              <a
                href={`#${heading.id}`}
                aria-current={active ? 'location' : undefined}
                className={`block border-l py-0.5 pl-2 transition-colors ${
                  active
                    ? 'border-accent font-medium text-accent'
                    : 'border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                {heading.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
