import type { ReactNode } from 'react';
import { PipelineFigure } from './PipelineFigure';
import { CodeTabs, type CodeTab } from './CodeTabs';
import type { PipelineLayout } from './pipeline';

export interface TraceChunk {
  rank: number;
  source: string;
  score: number;
  content: string;
  modality?: string;
}

interface PipelineSummaryProps {
  diagramTitle: string;
  layout: PipelineLayout;
  insight: string;
  code: CodeTab[];
  /** Ordered plain-text walkthrough of the worked example. */
  trace: string[];
  /** Final retrieved set for the worked example, if the demo has one. */
  chunks?: TraceChunk[];
  /** Optional extra figure (e.g. an embedding-space scatter). */
  figure?: ReactNode;
}

/**
 * The lighter, non-stepping layout for the 6 single-pass RAG variants: pipeline
 * diagram, key insight, a numbered worked trace, the retrieved context, and the
 * full Python. No interaction beyond the code tabs.
 */
export function PipelineSummary({
  diagramTitle,
  layout,
  insight,
  code,
  trace,
  chunks,
  figure,
}: PipelineSummaryProps) {
  return (
    <div className="flex flex-col gap-6">
      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-text-primary">Pipeline</h2>
        <PipelineFigure layout={layout} title={diagramTitle} />
      </section>

      {figure && <section className="flex flex-col gap-2">{figure}</section>}

      <section className="rounded-lg border border-border bg-bg-secondary p-4">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-text-tertiary">
          Key insight
        </h2>
        <p className="mt-2 text-sm text-text-secondary">{insight}</p>
      </section>

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-text-primary">Worked trace</h2>
        <ol className="flex flex-col gap-2 text-sm text-text-secondary">
          {trace.map((line, i) => (
            <li
              key={i}
              className="flex gap-3 rounded-md border border-border px-3 py-2"
            >
              <span className="shrink-0 font-mono text-xs text-text-tertiary">
                {i + 1}
              </span>
              <span>{line}</span>
            </li>
          ))}
        </ol>
      </section>

      {chunks && chunks.length > 0 && (
        <section className="flex flex-col gap-2">
          <h2 className="text-sm font-semibold text-text-primary">
            Retrieved context
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-text-tertiary">
                  <th className="py-2 pr-3 font-medium">#</th>
                  <th className="py-2 pr-3 font-medium">Source</th>
                  {chunks.some((c) => c.modality) && (
                    <th className="py-2 pr-3 font-medium">Modality</th>
                  )}
                  <th className="py-2 pr-3 font-medium">Score</th>
                  <th className="py-2 font-medium">Chunk</th>
                </tr>
              </thead>
              <tbody>
                {chunks.map((chunk) => (
                  <tr
                    key={chunk.rank}
                    className="border-b border-border align-top"
                  >
                    <td className="py-2 pr-3 font-mono text-xs text-text-tertiary">
                      {chunk.rank}
                    </td>
                    <td className="py-2 pr-3 font-mono text-xs">
                      {chunk.source}
                    </td>
                    {chunks.some((c) => c.modality) && (
                      <td className="py-2 pr-3 text-xs">{chunk.modality ?? ''}</td>
                    )}
                    <td className="py-2 pr-3 tabular-nums">
                      {chunk.score.toFixed(2)}
                    </td>
                    <td className="py-2 text-text-secondary">{chunk.content}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-text-primary">Implementation</h2>
        <CodeTabs tabs={code} />
      </section>
    </div>
  );
}
