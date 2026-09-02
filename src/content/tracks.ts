/**
 * Tracks — ordered reading paths through existing content. A track is a
 * *curation layer*, not a content `format`: `Nugget` / `format` are
 * unchanged and guides stay guides. `items` is a list of content ids in the
 * order they should be read; an id may reference content that isn't migrated
 * yet, in which case the UI shows a "Coming soon" row and skips it for
 * neighbour and progress math.
 *
 * Each track's `items` is the ordered id list of that ai-cauldron module's
 * migrated guides (see MERGE_PLAN.md). An id that doesn't resolve renders as
 * a "Coming soon" row and is skipped for neighbour/progress math.
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
    items: [
      'inference',
      'kv-cache',
      'context-window',
      'context-collapse',
      'quantization',
      'prompt-caching',
      'structured-outputs',
      'speculative-decoding',
      'mixture-of-experts',
      'tokenization',
    ],
  },
  {
    id: 'reasoning',
    title: 'Reasoning',
    summary:
      'How modern models think step by step — chain-of-thought, reasoning models, reward models, and search-based problem solving.',
    section: 'ai-reasoning',
    items: [
      'reasoning-models',
      'extended-thinking',
      'chain-of-thought',
      'reward-models',
      'tree-of-thoughts',
      'reflexion-meta-prompting',
      'evaluating-reasoning',
    ],
  },
  {
    id: 'model-adaptation',
    title: 'Model Adaptation',
    summary:
      'When and how to customise a model: fine-tuning strategies, LoRA, data curation, and preference optimisation.',
    section: 'ai-adaptation',
    items: [
      'when-to-finetune',
      'lora-qlora',
      'instruction-finetuning',
      'dpo',
      'structured-outputs-finetuning',
      'distillation',
      'model-merging',
      'evaluating-finetuned',
    ],
  },
  {
    id: 'rag',
    title: 'Retrieval-Augmented Generation',
    summary:
      'How RAG works end to end, from chunking and embeddings through production retrieval architecture and evaluation.',
    section: 'ai-retrieval',
    items: [
      'what-is-rag',
      'rag-pipeline',
      'vector-search',
      'chunking-strategies',
      'building-first-rag',
      'naive-vs-production',
      'improvements-and-advanced',
      'common-issues',
      'evaluation-metrics',
      'rag-tools-and-frameworks',
      'late-chunking',
      'multi-vector-retrieval',
      'rag-fusion',
      'contextual-compression',
      'semantic-caching',
      'open-knowledge-format',
      'knowledge-architecture',
    ],
  },
  {
    id: 'agents',
    title: 'AI Agents',
    summary:
      'Building autonomous agents that reason, plan, and use tools to finish complex multi-step tasks.',
    section: 'ai-agents',
    items: [
      'what-is-agentic-ai',
      'agent-architecture',
      'building-first-agent',
      'common-challenges',
      'tool-use',
      'memory-systems',
      'planning-reasoning',
      'evaluation',
      'agentic-advanced-topics',
      'model-context-protocol',
      'computer-use',
      'code-agents',
      'voice-agents',
    ],
  },
  {
    id: 'orchestration',
    title: 'Orchestration',
    summary:
      'Designing and operating multi-agent systems: orchestration frameworks, state management, and production tooling.',
    section: 'ai-orchestration',
    items: [
      'what-is-agent-harness',
      'framework-landscape',
      'orchestration-patterns',
      'continuous-iteration-loops',
      'tool-state-management',
      'human-in-the-loop',
      'observability-tracing',
      'production-deployment',
      'durable-execution',
      'streaming-architecture',
    ],
  },
  {
    id: 'safety-guardrails',
    title: 'Safety & Guardrails',
    summary:
      'Systematic AI safety engineering — failure-mode taxonomy, prompt-injection defence, red teaming, and guardrail frameworks.',
    section: 'ai-safety',
    items: [
      'failure-modes',
      'prompt-injection',
      'red-teaming',
      'guardrails-frameworks',
      'output-validation',
      'pii-privacy',
      'content-moderation',
      'ai-governance',
    ],
  },
  {
    id: 'evaluation',
    title: 'Evaluation',
    summary:
      'Measuring what matters in an AI system, from basic metrics to automated evaluation pipelines.',
    section: 'ai-evaluation',
    items: [
      'what-are-evals',
      'evaluation-types',
      'essential-metrics',
      'building-first-eval',
      'evaluation-workflow',
      'common-pitfalls',
      'evals-tools-and-frameworks',
      'evals-advanced-topics',
      'benchmark-contamination',
      'prompt-regression-testing',
    ],
  },
  {
    id: 'mlops',
    title: 'MLOps & Infra',
    summary:
      'Operating AI systems in production: CI/CD gates, deployment strategies, monitoring, and lifecycle management.',
    section: 'ai-mlops',
    items: [
      'what-is-mlops',
      'cicd-for-ai',
      'deployment-strategies',
      'monitoring-observability',
      'security-compliance',
      'reliability-scale',
      'model-lifecycle',
      'guardrails',
      'mlops-advanced-topics',
      'prompt-version-control',
      'data-flywheels',
      'ai-cost-optimization',
    ],
  },
];

export function getTrack(id: string): Track | undefined {
  return TRACKS.find((track) => track.id === id);
}

/** The first track whose `items` includes `contentId`, if any. */
export function trackForItem(contentId: string): Track | undefined {
  return TRACKS.find((track) => track.items.includes(contentId));
}
