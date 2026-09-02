export interface EmbeddingPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  type: 'query' | 'hypothesis' | 'document';
}

const TYPE_COLOR: Record<EmbeddingPoint['type'], string> = {
  query: 'var(--color-node-input)',
  hypothesis: 'var(--color-node-llm)',
  document: 'var(--color-text-tertiary)',
};

/**
 * Static reduction of ai-cauldron's animated HyDE `EmbeddingSpace`: a 2-D
 * scatter showing question-space and answer-space clusters with the query and
 * the hypothetical-document vector marked.
 */
export function EmbeddingSpace({
  points,
  caption,
}: {
  points: EmbeddingPoint[];
  caption?: string;
}) {
  return (
    <figure className="m-0 overflow-x-auto rounded-lg border border-border bg-bg-secondary p-3">
      <svg
        viewBox="0 0 400 300"
        role="img"
        aria-label={caption ?? 'Embedding-space scatter plot'}
        className="h-auto w-full min-w-[300px]"
      >
        <text
          x={12}
          y={20}
          fontSize={11}
          fontFamily="monospace"
          fill="var(--color-text-tertiary)"
        >
          Embedding space
        </text>
        <text x={30} y={52} fontSize={11} fill="var(--color-text-secondary)">
          Question space
        </text>
        <text
          x={370}
          y={280}
          textAnchor="end"
          fontSize={11}
          fill="var(--color-text-secondary)"
        >
          Answer space
        </text>

        {points.map((point) => (
          <g key={point.id}>
            <circle
              cx={point.x}
              cy={point.y}
              r={point.type === 'document' ? 4 : 7}
              fill={TYPE_COLOR[point.type]}
              fillOpacity={point.type === 'document' ? 0.45 : 1}
            />
            {point.type !== 'document' && point.label && (
              <text
                x={point.x}
                y={point.y - 12}
                textAnchor="middle"
                fontSize={10}
                fontWeight={600}
                fill="var(--color-text-primary)"
              >
                {point.label}
              </text>
            )}
          </g>
        ))}
      </svg>
      {caption && (
        <figcaption className="mt-2 text-xs text-text-tertiary">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
