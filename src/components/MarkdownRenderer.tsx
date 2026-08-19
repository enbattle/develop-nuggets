import ReactMarkdown, { type Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Link } from 'react-router-dom';
import { CodeBlock } from './CodeBlock';
import { MermaidDiagram } from './MermaidDiagram';

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
    // everything else is a real external link.
    if (href?.startsWith('/')) {
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
  return (
    <div className="prose prose-slate max-w-none dark:prose-invert">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
