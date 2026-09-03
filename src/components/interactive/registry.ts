import type { ComponentType } from 'react';

export type InteractiveKind = 'stepper' | 'summary';

export interface InteractiveEntry {
  /** URL segment: /interactive/<id> */
  id: string;
  name: string;
  kind: InteractiveKind;
  /** One line — "what this shows". */
  blurb: string;
  load: () => Promise<{ default: ComponentType }>;
}

/**
 * All 10 RAG pipelines ported from ai-cauldron. `summary` entries are a
 * pipeline diagram + full Python + a worked retrieval trace; `stepper` entries
 * add a prev/next walkthrough over a highlighted diagram (the loop-structured
 * algorithms, where the order of states is the point).
 */
export const INTERACTIVE: InteractiveEntry[] = [
  {
    id: 'standard',
    name: 'Standard RAG',
    kind: 'summary',
    blurb: 'The baseline: embed the query, take top-K by similarity, generate — no quality gate.',
    load: () => import('./standard/index'),
  },
  {
    id: 'hybrid',
    name: 'Hybrid RAG',
    kind: 'summary',
    blurb: 'BM25 and dense retrieval fused with RRF, then a cross-encoder reranker.',
    load: () => import('./hybrid/index'),
  },
  {
    id: 'hyde',
    name: 'HyDE',
    kind: 'summary',
    blurb: 'Embed a hypothetical answer instead of the question, so search starts from answer-space.',
    load: () => import('./hyde/index'),
  },
  {
    id: 'multimodal',
    name: 'Multi-modal RAG',
    kind: 'summary',
    blurb: 'Retrieve across text, image, and table indexes, then reason over all three.',
    load: () => import('./multimodal/index'),
  },
  {
    id: 'adaptive',
    name: 'Adaptive-RAG',
    kind: 'summary',
    blurb: 'A classifier routes each query to no-retrieval, single-step, or multi-step.',
    load: () => import('./adaptive/index'),
  },
  {
    id: 'rag-fusion',
    name: 'RAG Fusion',
    kind: 'summary',
    blurb: 'N query reformulations, N retrieval passes, one RRF-fused ranking.',
    load: () => import('./rag-fusion/index'),
  },
  {
    id: 'agentic',
    name: 'Agentic RAG',
    kind: 'stepper',
    blurb: 'A ReAct loop: the agent reasons, retrieves, observes, and repeats until context is sufficient.',
    load: () => import('./agentic/index'),
  },
  {
    id: 'self-rag',
    name: 'Self-RAG',
    kind: 'stepper',
    blurb: 'The generator emits reflection tokens and decides for itself whether to re-retrieve.',
    load: () => import('./self-rag/index'),
  },
  {
    id: 'corrective',
    name: 'Corrective RAG',
    kind: 'stepper',
    blurb: 'A relevance evaluator gates retrieval and falls back to web search when it fails.',
    load: () => import('./corrective/index'),
  },
  {
    id: 'graph',
    name: 'GraphRAG',
    kind: 'stepper',
    blurb: 'Extract entities, then traverse a knowledge graph hop by hop for relational context.',
    load: () => import('./graph/index'),
  },
];

export function getInteractive(id: string | undefined): InteractiveEntry | undefined {
  return INTERACTIVE.find((entry) => entry.id === id);
}
