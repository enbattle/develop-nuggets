import {
  anchor,
  CANVAS,
  edgePath,
  NODE_KIND_COLOR,
  type PipelineLayout,
  type Side,
} from './pipeline';

interface PipelineFigureProps {
  layout: PipelineLayout;
  /** Accessible name / caption for the diagram. */
  title: string;
}

/**
 * Static inline-SVG render of a `PipelineLayout`. Every node carries a
 * `data-node-id` and every edge a space-joined `data-edge-id`, so `StepThrough`
 * can toggle `.is-active` / `.is-visited` on them per step. Rendered on its own
 * (in the summary demos) it just shows the whole pipeline at full strength.
 */
export function PipelineFigure({ layout, title }: PipelineFigureProps) {
  const nodeById = new Map(layout.nodes.map((n) => [n.id, n]));

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-bg-secondary p-3">
      <svg
        viewBox={`0 0 ${CANVAS.w} ${CANVAS.h}`}
        role="img"
        aria-label={title}
        className="h-auto w-full min-w-[620px]"
      >
        <defs>
          <marker
            id="if-arrowhead"
            markerWidth="9"
            markerHeight="9"
            refX="7"
            refY="3"
            orient="auto"
          >
            <path d="M0,0 L0,6 L6,3 z" fill="var(--color-text-tertiary)" />
          </marker>
        </defs>

        {layout.edges.map((edge) => {
          const from = nodeById.get(edge.from);
          const to = nodeById.get(edge.to);
          if (!from || !to) return null;
          const fromSide: Side = edge.fromSide ?? 'right';
          const toSide: Side = edge.toSide ?? 'left';
          const bend = edge.bend ?? (edge.curve === 'loop-back' ? 50 : 60);
          const d = edgePath(
            anchor(from, fromSide),
            fromSide,
            anchor(to, toSide),
            toSide,
            bend,
          );
          return (
            <path
              key={edge.id}
              data-edge-id={(edge.activeWhen ?? [edge.id]).join(' ')}
              d={d}
              fill="none"
              stroke="var(--color-text-tertiary)"
              strokeWidth={2}
              markerEnd="url(#if-arrowhead)"
            />
          );
        })}

        {layout.nodes.map((node) => {
          const color = NODE_KIND_COLOR[node.kind ?? 'input'];
          const cx = node.x + node.w / 2;
          return (
            <g key={node.id} data-node-id={node.id} style={{ color }}>
              <rect
                x={node.x}
                y={node.y}
                width={node.w}
                height={node.h}
                rx={12}
                fill={color}
                fillOpacity={0.12}
                stroke={color}
                strokeWidth={1.75}
              />
              <text
                x={cx}
                y={node.y + node.h / 2 + 4}
                textAnchor="middle"
                fontSize={12}
                fontWeight={600}
                fill="currentColor"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
