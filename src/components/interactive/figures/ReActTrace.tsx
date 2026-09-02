export interface ReActEntry {
  iteration: number;
  type: 'thought' | 'action' | 'observation';
  content: string;
}

const LABEL: Record<ReActEntry['type'], string> = {
  thought: 'Thought',
  action: 'Action',
  observation: 'Observation',
};

const COLOR: Record<ReActEntry['type'], string> = {
  thought: 'var(--color-text-tertiary)',
  action: 'var(--color-node-agent)',
  observation: 'var(--color-node-retrieval)',
};

/**
 * Static reduction of ai-cauldron's animated `ReActTrace` — the reason / act /
 * observe log for the Agentic RAG loop, grouped by iteration. Folded in beside
 * the Agentic stepper.
 */
export function ReActTrace({ entries }: { entries: ReActEntry[] }) {
  const iterations = [...new Set(entries.map((e) => e.iteration))];

  return (
    <div className="rounded-lg border border-border bg-bg-secondary p-4">
      <h3 className="text-sm font-semibold text-text-primary">ReAct trace</h3>
      <p className="mt-1 text-xs text-text-tertiary">
        {iterations.length} iteration{iterations.length === 1 ? '' : 's'}
      </p>
      <div className="mt-3 flex flex-col gap-4">
        {iterations.map((iteration) => (
          <div key={iteration} className="flex flex-col gap-2">
            <p className="font-mono text-xs font-semibold text-text-primary">
              Iteration {iteration}
            </p>
            {entries
              .filter((entry) => entry.iteration === iteration)
              .map((entry, i) => (
                <div
                  key={i}
                  className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
                >
                  <span
                    className="shrink-0 font-mono text-xs font-medium sm:w-24"
                    style={{ color: COLOR[entry.type] }}
                  >
                    [{LABEL[entry.type]}]
                  </span>
                  <span className="text-sm text-text-secondary">
                    {entry.content}
                  </span>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
