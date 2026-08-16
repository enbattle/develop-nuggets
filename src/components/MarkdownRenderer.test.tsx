import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/utils';
import { MarkdownRenderer } from './MarkdownRenderer';

// CodeBlock/MermaidDiagram do real async Shiki/Mermaid rendering — stub them
// so this file tests MarkdownRenderer's own routing logic, not theirs.
vi.mock('./CodeBlock', () => ({
  CodeBlock: ({ code, language }: { code: string; language: string }) => (
    <div data-testid="code-block" data-language={language}>
      {code}
    </div>
  ),
}));
vi.mock('./MermaidDiagram', () => ({
  MermaidDiagram: ({ chart }: { chart: string }) => (
    <div data-testid="mermaid-diagram">{chart}</div>
  ),
}));

describe('MarkdownRenderer', () => {
  it('renders inline code as <code>, not a code block', () => {
    render(<MarkdownRenderer content="Use `foo()` here." />);

    expect(screen.getByText('foo()').tagName).toBe('CODE');
    expect(screen.queryByTestId('code-block')).not.toBeInTheDocument();
  });

  it('renders a fenced code block via CodeBlock with its language', () => {
    render(<MarkdownRenderer content={'```ts\nconst x = 1;\n```'} />);

    const block = screen.getByTestId('code-block');
    expect(block).toHaveAttribute('data-language', 'ts');
    expect(block).toHaveTextContent('const x = 1;');
  });

  it('renders a mermaid fence via MermaidDiagram, not CodeBlock', () => {
    render(
      <MarkdownRenderer content={'```mermaid\nflowchart LR\nA --> B\n```'} />,
    );

    expect(screen.getByTestId('mermaid-diagram')).toHaveTextContent(
      'flowchart LR',
    );
    expect(screen.queryByTestId('code-block')).not.toBeInTheDocument();
  });

  it('routes internal /nuggets links through client-side navigation', () => {
    render(
      <MarkdownRenderer content="See [idempotent](/nuggets/idempotency)." />,
    );

    const link = screen.getByRole('link', { name: 'idempotent' });
    expect(link).toHaveAttribute('href', '/nuggets/idempotency');
    expect(link).not.toHaveAttribute('target');
  });

  it('opens external links in a new tab', () => {
    render(<MarkdownRenderer content="See [docs](https://example.com)." />);

    const link = screen.getByRole('link', { name: 'docs' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
