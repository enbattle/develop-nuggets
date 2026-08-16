import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';
import { useTheme } from '@/contexts/ThemeContext';

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
    mermaid.initialize({
      startOnLoad: false,
      theme: theme === 'dark' ? 'dark' : 'default',
      securityLevel: 'strict',
    });
    mermaid
      .render(`mermaid-${id}`, chart)
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
