import { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';
import { useTheme } from '@/contexts/ThemeContext';

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const { theme } = useTheme();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    codeToHtml(code, {
      lang: language || 'text',
      theme: theme === 'dark' ? 'github-dark' : 'github-light',
    })
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        // Unknown language grammar — fall back to plain <pre>.
        if (!cancelled) setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  if (!html) {
    return (
      <pre className="overflow-x-auto rounded-lg border border-border bg-bg-tertiary p-4 text-sm">
        <code>{code}</code>
      </pre>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-lg border border-border text-sm [&_pre]:!bg-transparent [&_pre]:p-4"
      // Shiki-generated HTML from the user's own locally-stored content.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
