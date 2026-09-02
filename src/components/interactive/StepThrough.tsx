import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { CodeTabs, type CodeTab } from './CodeTabs';

export interface Step {
  /** One-line description of this state — the must-have. */
  caption: string;
  /** Optional second line of detail. */
  detail?: string;
  /** Diagram node ids lit at this step. */
  activeNodeIds?: string[];
  /** Diagram edge ids lit at this step. */
  activeEdgeIds?: string[];
}

interface StepThroughProps {
  steps: Step[];
  /** Static SVG (or Mermaid) diagram. Nodes/edges with matching `data-node-id` /
   *  `data-edge-id` get `.is-active` / `.is-visited` toggled per step. */
  diagram: ReactNode;
  onStepChange?: (index: number) => void;
  code?: CodeTab[];
}

// Scoped by `.st-diagram`; safe to repeat if several steppers mount at once.
const HIGHLIGHT_CSS = `
.st-diagram [data-node-id],
.st-diagram [data-edge-id] { opacity: 0.38; transition: opacity 0.2s ease; }
.st-diagram [data-node-id].is-visited,
.st-diagram [data-edge-id].is-visited { opacity: 0.7; }
.st-diagram [data-node-id].is-active,
.st-diagram [data-edge-id].is-active { opacity: 1; }
.st-diagram [data-node-id].is-active { filter: drop-shadow(0 0 3px currentColor); }
`;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
}

/**
 * Reusable prev/next walkthrough of captioned states over a static diagram.
 * No motion library, no timers — the reader drives it with the buttons or the
 * `←` / `→` keys; `R` resets to the first step.
 */
export function StepThrough({
  steps,
  diagram,
  onStepChange,
  code,
}: StepThroughProps) {
  const [index, setIndex] = useState(0);
  const diagramRef = useRef<HTMLDivElement>(null);
  const total = steps.length;
  const step = steps[index];

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => {
        const clamped = Math.max(0, Math.min(total - 1, next));
        return clamped === cur ? cur : clamped;
      });
    },
    [total],
  );

  useEffect(() => {
    onStepChange?.(index);
  }, [index, onStepChange]);

  // Sync diagram highlighting to the current step.
  useEffect(() => {
    const root = diagramRef.current;
    if (!root) return;
    const activeNodes = new Set(steps[index]?.activeNodeIds ?? []);
    const activeEdges = new Set(steps[index]?.activeEdgeIds ?? []);
    const visitedNodes = new Set<string>();
    const visitedEdges = new Set<string>();
    for (let i = 0; i < index; i++) {
      steps[i]?.activeNodeIds?.forEach((id) => visitedNodes.add(id));
      steps[i]?.activeEdgeIds?.forEach((id) => visitedEdges.add(id));
    }

    root.querySelectorAll<SVGElement>('[data-node-id]').forEach((el) => {
      const id = el.getAttribute('data-node-id') ?? '';
      const on = activeNodes.has(id);
      el.classList.toggle('is-active', on);
      el.classList.toggle('is-visited', !on && visitedNodes.has(id));
    });
    root.querySelectorAll<SVGElement>('[data-edge-id]').forEach((el) => {
      const ids = (el.getAttribute('data-edge-id') ?? '').split(/\s+/);
      const on = ids.some((i) => activeEdges.has(i));
      const seen = !on && ids.some((i) => visitedEdges.has(i));
      el.classList.toggle('is-active', on);
      el.classList.toggle('is-visited', seen);
    });
  }, [index, steps]);

  // `←` / `→` step, `R` resets. Ignored while typing; j/k are left alone.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(index + 1);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        go(0);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [index, go]);

  return (
    <div className="flex flex-col gap-4">
      <style>{HIGHLIGHT_CSS}</style>

      <div ref={diagramRef} className="st-diagram">
        {diagram}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => go(index - 1)}
          disabled={index === 0}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          &larr; Prev
        </button>
        <button
          type="button"
          onClick={() => go(index + 1)}
          disabled={index === total - 1}
          className="rounded-md border border-border px-3 py-1.5 text-sm font-medium text-text-secondary transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next &rarr;
        </button>
        <span className="text-sm tabular-nums text-text-tertiary" aria-live="polite">
          Step {index + 1} of {total}
        </span>
        <button
          type="button"
          onClick={() => go(0)}
          disabled={index === 0}
          className="ml-auto rounded-md px-2 py-1 text-xs font-medium text-text-tertiary transition-colors hover:text-text-primary disabled:opacity-40"
        >
          Reset (R)
        </button>
      </div>

      <div className="rounded-lg border border-border bg-bg-secondary p-4">
        <p className="text-sm font-medium text-text-primary">{step?.caption}</p>
        {step?.detail && (
          <p className="mt-2 text-sm text-text-secondary">{step.detail}</p>
        )}
      </div>

      {code && code.length > 0 && <CodeTabs tabs={code} />}
    </div>
  );
}
