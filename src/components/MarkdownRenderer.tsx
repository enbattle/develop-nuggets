import { type ReactNode } from 'react';
import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { CodeBlock } from './CodeBlock';
import { MermaidDiagram } from './MermaidDiagram';
import { dedupe, slugify } from '@/lib/slug';

/** Flatten a React children tree to its plain-text content, for slugging. */
function textContent(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textContent).join('');
  if (typeof node === 'object' && 'props' in node) {
    return textContent((node as { props: { children?: ReactNode } }).props.children);
  }
  return '';
}

const components: Components = {
  // CodeBlock and MermaidDiagram each render their own complete markup
  // (Shiki emits its own themed <pre>; Mermaid needs no <pre> at all) —
  // without this override, react-markdown's default `pre` wraps them in
  // an extra <pre>, which picks up Tailwind Typography's dark "terminal"
  // background from the surrounding `.prose` scope. In light mode that
  // put Shiki's light-theme (dark-on-white) text on top of that dark
  // background — illegible. Rendering only the children here removes the
  // unwanted wrapper.
  pre({ children }) {
    return <>{children}</>;
  },
  a({ href, children, ...props }) {
    // Internal cross-references (e.g. to another nugget) navigate client-side;
    // everything else is a real external link. A protocol-relative `//host`
    // href also starts with `/` but points off-site — exclude it so it can't
    // be routed through <Link> as an open redirect.
    if (href?.startsWith('/') && !href.startsWith('//')) {
      return (
        <Link to={href} className="text-accent hover:text-accent-hover">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-accent hover:text-accent-hover"
        {...props}
      >
        {children}
      </a>
    );
  },
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? '');
    const code = String(children).replace(/\n$/, '');
    const isInline = !match && !code.includes('\n');

    if (isInline) {
      return (
        <code
          className="rounded bg-bg-tertiary px-1.5 py-0.5 text-[0.85em] text-text-primary"
          {...props}
        >
          {children}
        </code>
      );
    }

    const language = match?.[1] ?? 'text';
    if (language === 'mermaid') {
      return <MermaidDiagram chart={code} />;
    }
    return <CodeBlock code={code} language={language} />;
  },
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // Fresh per render: stamps `id`s on `##`/`###` headings so the table of
  // contents can link to them. Deduping matches `extractHeadings` in
  // `@/lib/slug` so a TOC entry always points at a real anchor. `scroll-mt`
  // keeps an anchored heading clear of the sticky header.
  const seen = new Map<string, number>();
  const headingId = (children: ReactNode) =>
    dedupe(slugify(textContent(children)), seen);

  const withHeadings: Components = {
    ...components,
    h2({ children, ...props }) {
      return (
        <h2 id={headingId(children)} className="scroll-mt-20" {...props}>
          {children}
        </h2>
      );
    },
    h3({ children, ...props }) {
      return (
        <h3 id={headingId(children)} className="scroll-mt-20" {...props}>
          {children}
        </h3>
      );
    },
  };

  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={withHeadings}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
