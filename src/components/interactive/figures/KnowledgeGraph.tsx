export interface GraphNode {
  id: string;
  label: string;
  type: string;
}

export interface GraphEdge {
  source: string;
  target: string;
  label: string;
  hop: 1 | 2;
}

// Fixed positions for the GraphRAG demo graph, keyed by lowercased node id.
const POSITIONS: Record<string, { x: number; y: number }> = {
  openai: { x: 200, y: 70 },
  'gpt-4': { x: 105, y: 180 },
  microsoft: { x: 295, y: 180 },
  copilot: { x: 200, y: 290 },
};

const HOP_COLOR: Record<1 | 2, string> = {
  1: 'var(--color-node-retrieval)',
  2: 'var(--color-node-decision)',
};

/**
 * Static reduction of ai-cauldron's animated `KnowledgeGraph`: entity nodes and
 * labeled relationship edges, 1-hop solid and 2-hop dashed.
 */
export function KnowledgeGraph({
  nodes,
  edges,
  caption,
}: {
  nodes: GraphNode[];
  edges: GraphEdge[];
  caption?: string;
}) {
  return (
    <figure className="m-0 overflow-x-auto rounded-lg border border-border bg-bg-secondary p-3">
      <svg
        viewBox="0 0 400 340"
        role="img"
        aria-label={caption ?? 'Knowledge graph'}
        className="h-auto w-full min-w-[300px]"
      >
        {edges.map((edge) => {
          const a = POSITIONS[edge.source.toLowerCase()];
          const b = POSITIONS[edge.target.toLowerCase()];
          if (!a || !b) return null;
          return (
            <g key={`${edge.source}-${edge.target}-${edge.label}`}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke={HOP_COLOR[edge.hop]}
                strokeWidth={edge.hop === 1 ? 2 : 1.5}
                strokeDasharray={edge.hop === 2 ? '4 3' : undefined}
              />
              <text
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 3}
                textAnchor="middle"
                fontSize={9}
                fill="var(--color-text-tertiary)"
              >
                {edge.label}
              </text>
            </g>
          );
        })}

        {nodes.map((node) => {
          const pos = POSITIONS[node.id.toLowerCase()];
          if (!pos) return null;
          return (
            <g key={node.id}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r={26}
                fill="var(--color-bg-tertiary)"
                stroke="var(--color-border)"
                strokeWidth={2}
              />
              <text
                x={pos.x}
                y={pos.y + 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--color-text-primary)"
              >
                {node.label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-xs text-text-tertiary">
        Solid = 1-hop, dashed = 2-hop{caption ? ` — ${caption}` : ''}
      </figcaption>
    </figure>
  );
}
