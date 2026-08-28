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
};

/**
 * The order sections appear in the sidebar and on the home page — roughly
 * foundational first, then outer layers (APIs, data) inward to cross-cutting
 * concerns (reliability, delivery). Not alphabetical, and not derived from
 * the union's declaration order, so it's changed here deliberately.
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
];
