/**
 * Tracks — ordered reading paths through existing content. A track is a
 * *curation layer*, not a content `format`: `Nugget` / `format` are
 * unchanged and guides stay guides. `items` is a list of content ids in the
 * order they should be read; an id may reference content that isn't migrated
 * yet, in which case the UI shows a "Coming soon" row and skips it for
 * neighbour and progress math.
 *
 * Seeded here with real `id` / `title` / `section` / `summary`; `items` is
 * filled per-module in Phase 2 of the ai-cauldron merge (see MERGE_PLAN.md).
 */

import type { Section } from '@/types';

export interface Track {
  /** URL slug, e.g. `rag` → `/tracks/rag`. */
  id: string;
  title: string;
  /** One sentence on what the track covers — same voice as `Nugget.summary`. */
  summary: string;
  /** The AI section this track's content is filed under. */
  section: Section;
  /** Ordered content ids. May include ids that don't resolve yet. */
  items: string[];
}

/**
 * The nine tracks, 1:1 with the ai-cauldron modules and (after the
 * 9-section split) 1:1 with the AI sections too.
 */
export const TRACKS: Track[] = [
  {
    id: 'llm-internals',
    title: 'LLM Internals',
    summary:
      'How LLMs work under the hood: inference mechanics, memory management, and the optimisations that make them practical to run.',
    section: 'ai-llm-internals',
    items: [],
  },
  {
    id: 'reasoning',
    title: 'Reasoning',
    summary:
      'How modern models think step by step — chain-of-thought, reasoning models, reward models, and search-based problem solving.',
    section: 'ai-reasoning',
    items: [],
  },
  {
    id: 'model-adaptation',
    title: 'Model Adaptation',
    summary:
      'When and how to customise a model: fine-tuning strategies, LoRA, data curation, and preference optimisation.',
    section: 'ai-adaptation',
    items: [],
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation',
    summary:
      'How RAG works end to end, from chunking and embeddings through production retrieval architecture and evaluation.',
    section: 'ai-retrieval',
    items: [],
  },
  {
    id: 'agents',
    title: 'AI Agents',
    summary:
      'Building autonomous agents that reason, plan, and use tools to finish complex multi-step tasks.',
    section: 'ai-agents',
    items: [],
  },
  {
    id: 'orchestration',
    title: 'Orchestration',
    summary:
      'Designing and operating multi-agent systems: orchestration frameworks, state management, and production tooling.',
    section: 'ai-orchestration',
    items: [],
  },
  {
    id: 'safety-guardrails',
    title: 'Safety & Guardrails',
    summary:
      'Systematic AI safety engineering — failure-mode taxonomy, prompt-injection defence, red teaming, and guardrail frameworks.',
    section: 'ai-safety',
    items: [],
  },
  {
    id: 'evaluation',
    title: 'Evaluation',
    summary:
      'Measuring what matters in an AI system, from basic metrics to automated evaluation pipelines.',
    section: 'ai-evaluation',
    items: [],
  },
  {
    id: 'mlops',
    title: 'MLOps & Infra',
    summary:
      'Operating AI systems in production: CI/CD gates, deployment strategies, monitoring, and lifecycle management.',
    section: 'ai-mlops',
    items: [],
  },
];

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((track) => track.id === id);
}

/** The first track whose `items` includes `contentId`, if any. */
export function trackForItem(contentId: string): Track | undefined {
  return TRACKS.find((track) => track.items.includes(contentId));
}
