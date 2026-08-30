import { useEffect, useId, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// Mermaid (plus the diagram engines it pulls in) is the heaviest dependency
// in the markdown-rendering path, and 16 of the ~58 content pages have no
// diagram at all. Import it only when a ```mermaid fence actually renders,
// cached for the rest of the session — same lazy pattern as Shiki in CodeBlock.
type MermaidApi = (typeof import('mermaid'))['default'];

let mermaidPromise: Promise<MermaidApi> | null = null;
function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= import('mermaid').then((module) => module.default);
  return mermaidPromise;
}

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const { theme } = useTheme();
  const id = useId().replace(/:/g, '-');
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadMermaid()
      .then((mermaid) => {
        mermaid.initialize({
          startOnLoad: false,
          theme: theme === 'dark' ? 'dark' : 'default',
          securityLevel: 'strict',
        });
        return mermaid.render(`mermaid-${id}`, chart);
      })
      .then(({ svg: rendered }) => {
        if (!cancelled) {
          setSvg(rendered);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to render diagram',
          );
        }
      });
    return () => {
      cancelled = true;
    };
  }, [chart, theme, id]);

  if (error) {
    return (
      <div className="my-4 rounded-lg border border-border bg-bg-tertiary p-4 text-sm text-text-tertiary">
        Couldn't render diagram: {error}
      </div>
    );
  }

  if (!svg) return null;

  return (
    <div
      className="my-4 flex justify-center overflow-x-auto rounded-lg border border-border bg-bg-secondary p-4"
      // mermaid.render output, sanitized via securityLevel: 'strict'.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
