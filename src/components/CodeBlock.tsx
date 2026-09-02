import { useEffect, useRef, useState } from 'react';
import type { HighlighterCore, LanguageRegistration } from 'shiki/core';
import { useTheme } from '@/contexts/ThemeContext';

type LangModule = { default: LanguageRegistration[] };

// Grammars are the heavy part of Shiki, so nothing here is imported
// statically — the core, the two themes, and each language grammar are all
// lazy `import()`s. A grammar is fetched only the first time a code fence
// actually uses that language, then cached for the session. Add an entry
// here when content starts using a new language; an unmapped language just
// renders as a plain <pre>.
const LANGUAGE_LOADERS: Record<string, () => Promise<LangModule>> = {
  bash: () => import('shiki/langs/bash.mjs'),
  sh: () => import('shiki/langs/bash.mjs'),
  dockerfile: () => import('shiki/langs/dockerfile.mjs'),
  graphql: () => import('shiki/langs/graphql.mjs'),
  html: () => import('shiki/langs/html.mjs'),
  js: () => import('shiki/langs/javascript.mjs'),
  javascript: () => import('shiki/langs/javascript.mjs'),
  json: () => import('shiki/langs/json.mjs'),
  lua: () => import('shiki/langs/lua.mjs'),
  markdown: () => import('shiki/langs/markdown.mjs'),
  md: () => import('shiki/langs/markdown.mjs'),
  protobuf: () => import('shiki/langs/protobuf.mjs'),
  python: () => import('shiki/langs/python.mjs'),
  py: () => import('shiki/langs/python.mjs'),
  sql: () => import('shiki/langs/sql.mjs'),
  ts: () => import('shiki/langs/typescript.mjs'),
  typescript: () => import('shiki/langs/typescript.mjs'),
  yaml: () => import('shiki/langs/yaml.mjs'),
  yml: () => import('shiki/langs/yaml.mjs'),
};

let corePromise: Promise<HighlighterCore> | null = null;
function getCore() {
  corePromise ??= (async () => {
    const [
      { createHighlighterCore },
      { createJavaScriptRegexEngine },
      dark,
      light,
    ] = await Promise.all([
      import('shiki/core'),
      import('shiki/engine/javascript'),
      import('shiki/themes/github-dark.mjs'),
      import('shiki/themes/github-light.mjs'),
    ]);
    return createHighlighterCore({
      themes: [dark.default, light.default],
      langs: [],
      engine: createJavaScriptRegexEngine({ forgiving: true }),
    });
  })();
  return corePromise;
}

const loaded = new Set<string>();

async function highlight(
  code: string,
  language: string,
  theme: 'dark' | 'light',
): Promise<string> {
  const core = await getCore();
  const loader = LANGUAGE_LOADERS[language];
  let lang = 'text';
  if (loader) {
    if (!loaded.has(language)) {
      await core.loadLanguage((await loader()).default);
      loaded.add(language);
    }
    lang = language;
  }
  return core.codeToHtml(code, {
    lang,
    theme: theme === 'dark' ? 'github-dark' : 'github-light',
  });
}

interface CodeBlockProps {
  code: string;
  language: string;
}

export function CodeBlock({ code, language }: CodeBlockProps) {
  const { theme } = useTheme();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    highlight(code, language, theme)
      .then((result) => {
        if (!cancelled) setHtml(result);
      })
      .catch(() => {
        if (!cancelled) setHtml(null);
      });
    return () => {
      cancelled = true;
    };
  }, [code, language, theme]);

  if (!html) {
    return (
      <CodeShell code={code}>
        <pre className="overflow-x-auto rounded-lg border border-border bg-bg-tertiary p-4 text-sm">
          <code>{code}</code>
        </pre>
      </CodeShell>
    );
  }

  return (
    <CodeShell code={code}>
      <div
        className="overflow-x-auto rounded-lg border border-border text-sm [&_pre]:!bg-transparent [&_pre]:p-4"
        // Shiki-generated HTML from the app's own locally-stored content.
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </CodeShell>
  );
}

/** Wraps a rendered block with a hover-revealed "Copy" button. */
function CodeShell({
  code,
  children,
}: {
  code: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => () => clearTimeout(timeout.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard unavailable (insecure context, denied permission) — no-op.
    }
  };

  return (
    <div className="group relative not-prose">
      <button
        type="button"
        onClick={copy}
        aria-label="Copy code"
        className="absolute right-2 top-2 z-10 rounded-md border border-border bg-bg-secondary px-2 py-1 text-xs font-medium text-text-secondary opacity-0 transition-opacity hover:text-text-primary focus:opacity-100 group-hover:opacity-100"
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
      {children}
    </div>
  );
}
