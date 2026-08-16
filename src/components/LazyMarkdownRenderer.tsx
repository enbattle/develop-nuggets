import { lazy, Suspense } from 'react';

const MarkdownRenderer = lazy(() =>
  import('./MarkdownRenderer').then((module) => ({
    default: module.MarkdownRenderer,
  })),
);

interface LazyMarkdownRendererProps {
  content: string;
}

/** Markdown rendering pulls in Shiki + Mermaid, so it's only loaded when actually needed. */
export function LazyMarkdownRenderer({ content }: LazyMarkdownRendererProps) {
  return (
    <Suspense
      fallback={<p className="text-sm text-text-tertiary">Rendering…</p>}
    >
      <MarkdownRenderer content={content} />
    </Suspense>
  );
}
