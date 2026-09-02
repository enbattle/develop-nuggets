// Static pipeline-diagram model + geometry, shared by every /interactive demo.
// Ported from ai-cauldron's src/components/diagram (types.ts + geometry.ts),
// stripped of the animation/framer-motion machinery — these diagrams are drawn
// once and only ever restyled (opacity/glow) by StepThrough via CSS classes.

export type NodeKind =
  | 'input'
  | 'retrieval'
  | 'llm'
  | 'decision'
  | 'tool'
  | 'agent'
  | 'output';

export type Side = 'top' | 'right' | 'bottom' | 'left';

export interface NodeLayout {
  /** Matches a step's `activeNodeIds` value and becomes the SVG `data-node-id`. */
  id: string;
  label: string;
  kind?: NodeKind;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface EdgeLayout {
  id: string;
  from: string;
  to: string;
  /** Step `activeEdgeIds` values that light this line; defaults to `[id]`. */
  activeWhen?: string[];
  fromSide?: Side;
  toSide?: Side;
  curve?: 'straight' | 'loop-back' | 'fan';
  bend?: number;
}

export interface PipelineLayout {
  nodes: NodeLayout[];
  edges: EdgeLayout[];
}

/** Shared drawing canvas — every ported layout is authored against this box. */
export const CANVAS = { w: 940, h: 240 } as const;

/** Node fill/stroke color per kind, as a design-token reference. */
export const NODE_KIND_COLOR: Record<NodeKind, string> = {
  input: 'var(--color-node-input)',
  retrieval: 'var(--color-node-retrieval)',
  llm: 'var(--color-node-llm)',
  decision: 'var(--color-node-decision)',
  tool: 'var(--color-node-tool)',
  agent: 'var(--color-node-agent)',
  output: 'var(--color-node-output)',
};

interface Point {
  x: number;
  y: number;
}

const SIDE_NORMAL: Record<Side, Point> = {
  top: { x: 0, y: -1 },
  right: { x: 1, y: 0 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
};

/** Point on a node's edge for the given side. */
export function anchor(node: NodeLayout, side: Side): Point {
  switch (side) {
    case 'top':
      return { x: node.x + node.w / 2, y: node.y };
    case 'bottom':
      return { x: node.x + node.w / 2, y: node.y + node.h };
    case 'left':
      return { x: node.x, y: node.y + node.h / 2 };
    case 'right':
      return { x: node.x + node.w, y: node.y + node.h / 2 };
  }
}

/** Cubic-bezier `d` string between two anchors, bowed out along each side normal. */
export function edgePath(
  a: Point,
  aSide: Side,
  b: Point,
  bSide: Side,
  bend = 60,
): string {
  const na = SIDE_NORMAL[aSide];
  const nb = SIDE_NORMAL[bSide];
  const c1 = { x: a.x + na.x * bend, y: a.y + na.y * bend };
  const c2 = { x: b.x + nb.x * bend, y: b.y + nb.y * bend };
  return `M ${a.x} ${a.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${b.x} ${b.y}`;
}
