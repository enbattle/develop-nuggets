import { lazy, Suspense, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  INTERACTIVE,
  getInteractive,
  type InteractiveKind,
} from '@/components/interactive/registry';

const KIND_LABEL: Record<InteractiveKind, string> = {
  stepper: 'Step-through',
  summary: 'Pipeline + code',
};

const KIND_BLURB: Record<InteractiveKind, string> = {
  stepper:
    'Loop-structured pipelines — walk the states in order with the buttons or the ← / → keys.',
  summary:
    'Single-pass pipelines — diagram, full Python, and a worked retrieval trace.',
};

function BackLink() {
  return (
    <Link
      to="/interactive"
      className="text-sm font-medium text-accent hover:underline"
    >
      &larr; Back to all pipelines
    </Link>
  );
}

function NotFound() {
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-lg border border-dashed border-border p-10 text-center">
        <p className="text-sm text-text-secondary">Interactive demo not found.</p>
      </div>
      <BackLink />
    </div>
  );
}

function IndexView() {
  const groups: { kind: InteractiveKind; entries: typeof INTERACTIVE }[] = [
    { kind: 'stepper', entries: INTERACTIVE.filter((e) => e.kind === 'stepper') },
    { kind: 'summary', entries: INTERACTIVE.filter((e) => e.kind === 'summary') },
  ];

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold text-text-primary">
          Interactive RAG pipelines
        </h1>
        <p className="text-sm text-text-secondary">
          Ten retrieval-augmented-generation designs, each as a diagram with the
          Python beside it. The four loop-structured ones step through their
          states; the rest show the pipeline in a single pass.
        </p>
      </header>

      {groups.map((group) => (
        <section key={group.kind} className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-semibold text-text-primary">
              {KIND_LABEL[group.kind]}
            </h2>
            <p className="text-xs text-text-tertiary">{KIND_BLURB[group.kind]}</p>
          </div>
          <ul className="flex flex-col gap-2">
            {group.entries.map((entry) => (
              <li key={entry.id}>
                <Link
                  to={`/interactive/${entry.id}`}
                  className="flex flex-col gap-1 rounded-md border border-border px-3 py-2 transition-colors hover:border-accent"
                >
                  <span className="font-medium text-text-primary">
                    {entry.name}
                  </span>
                  <span className="text-xs text-text-secondary">
                    {entry.blurb}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

export default function InteractivePage() {
  const { id } = useParams<{ id: string }>();
  const entry = getInteractive(id);

  const Demo = useMemo(
    () => (entry ? lazy(entry.load) : null),
    // Re-create only when the resolved demo changes.
    [entry],
  );

  if (!id) return <IndexView />;
  if (!entry || !Demo) return <NotFound />;

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-tertiary">
          {KIND_LABEL[entry.kind]}
        </p>
        <h1 className="text-2xl font-bold text-text-primary">{entry.name}</h1>
        <p className="text-sm text-text-secondary">{entry.blurb}</p>
      </header>

      <Suspense
        fallback={
          <div className="rounded-lg border border-dashed border-border p-10 text-center text-sm text-text-tertiary">
            Loading demo…
          </div>
        }
      >
        <Demo />
      </Suspense>

      <div className="border-t border-border pt-6">
        <BackLink />
      </div>
    </div>
  );
}
