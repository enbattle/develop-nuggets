import type { Section } from '@/types';

/**
 * Display label per section. A `Record` keyed by the `Section` union (not a
 * per-section `if`/lookup) so TypeScript forces every section to have a label
 * the moment one is added to the union — same pattern as `FORMAT_LABELS`.
 */
export const SECTION_LABELS: Record<Section, string> = {
  foundations: 'Foundations',
  'apis-communication': 'APIs & Communication',
  'databases-modeling': 'Databases & Data Modeling',
  'data-stores': 'Data Stores',
  'scaling-performance': 'Scaling & Performance',
  reliability: 'Reliability & Resilience',
  messaging: 'Messaging & Events',
  networking: 'Networking',
  'security-auth': 'Security & Auth',
  delivery: 'Delivery & Tooling',
  'ai-llm-internals': 'LLM Internals',
  'ai-reasoning': 'Reasoning',
  'ai-adaptation': 'Model Adaptation',
  'ai-retrieval': 'Retrieval & RAG',
  'ai-agents': 'Agents',
  'ai-orchestration': 'Orchestration',
  'ai-safety': 'Safety & Guardrails',
  'ai-evaluation': 'Evaluation',
  'ai-mlops': 'MLOps & Infra',
};

/**
 * One-sentence charter per section — shown under the heading on the home page
 * so a reader knows what the section is for before scanning its items.
 */
export const SECTION_DESCRIPTIONS: Record<Section, string> = {
  foundations:
    'The mental models the rest of the catalog assumes — core tradeoffs, theorems, and vocabulary.',
  'apis-communication':
    'Designing, versioning, and securing the contracts between services.',
  'databases-modeling':
    'Structuring data and querying it without shooting yourself in the foot.',
  'data-stores':
    'What each specific database or storage system is good — and bad — at.',
  'scaling-performance':
    'Serving more traffic and data: sharding, caching, and read/write scaling.',
  reliability: 'Staying correct and available when parts of the system fail.',
  messaging:
    'Queues, event logs, and background jobs — moving work off the request path and keeping systems in sync.',
  networking:
    'How bytes get from one machine to another, and what sits in between.',
  'security-auth':
    'Proving who a request is from, deciding what it may do, and the web attacks that bypass both.',
  delivery:
    'Getting code into production safely: version control, testing, packaging, and rollout.',
  'ai-llm-internals':
    'How a language model turns tokens into text — attention, context windows, sampling, and why it hallucinates.',
  'ai-reasoning':
    'Getting stronger answers from a fixed model — structured prompting, chain-of-thought, and multi-step deliberation.',
  'ai-adaptation':
    'Changing what a model knows or how it behaves — fine-tuning, LoRA, preference optimization, and distillation.',
  'ai-retrieval':
    'Grounding model output in your own data — chunking, embeddings, vector search, and the RAG pipeline around them.',
  'ai-agents':
    'Letting a model plan, call tools, and act in loops — and keeping those loops from running away.',
  'ai-orchestration':
    'Wiring models, tools, and steps into one reliable pipeline — routing, chaining, and carrying state between calls.',
  'ai-safety':
    'Keeping model behavior inside bounds — prompt-injection defense, content filtering, and guardrails on input and output.',
  'ai-evaluation':
    'Measuring whether an LLM system actually works — eval sets, scoring rubrics, LLM-as-judge, and regression testing.',
  'ai-mlops':
    'Running an LLM system in production — CI/CD, deployment, monitoring, cost control, and data flywheels.',
};

/**
 * The order sections appear in the sidebar and on the home page — roughly
 * foundational first, then outer layers (APIs, data) inward to cross-cutting
 * concerns (reliability, delivery), then the AI-engineering sections in
 * pipeline order (internals → reasoning → adaptation → retrieval → agents →
 * orchestration → safety → evaluation → mlops). Not alphabetical, and not
 * derived from the union's declaration order, so it's changed here deliberately.
 */
export const SECTION_ORDER: Section[] = [
  'foundations',
  'apis-communication',
  'databases-modeling',
  'data-stores',
  'scaling-performance',
  'reliability',
  'messaging',
  'networking',
  'security-auth',
  'delivery',
  'ai-llm-internals',
  'ai-reasoning',
  'ai-adaptation',
  'ai-retrieval',
  'ai-agents',
  'ai-orchestration',
  'ai-safety',
  'ai-evaluation',
  'ai-mlops',
];

/**
 * The two top-level shelves the sections split into: classic systems/backend
 * material and AI-engineering material. Drives the domain toggle on the home
 * page and the super-grouping in the sidebar.
 */
export type Domain = 'systems' | 'ai';

/** A section is in the `ai` domain iff its value is prefixed `ai-`. */
export function sectionDomain(section: Section): Domain {
  return section.startsWith('ai-') ? 'ai' : 'systems';
}

/** Display label per domain — same exhaustiveness rationale as `SECTION_LABELS`. */
export const DOMAIN_LABELS: Record<Domain, string> = {
  systems: 'Systems & Infrastructure',
  ai: 'AI Engineering',
};

/** Order the domains are shown in — systems first, then AI. */
export const DOMAIN_ORDER: Domain[] = ['systems', 'ai'];
