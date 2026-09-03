/**
 * The one topic section an item is filed under — its "home shelf" in the
 * sidebar and on the home page. Exactly one per item, authored by hand.
 * Distinct from `tags`: tags are multi-valued and cross-cutting (and drive
 * "Related"), `section` is the single place a thing lives in the nav. See
 * `src/lib/sections.ts` for labels, charters, and display order.
 */
export type Section =
  // Systems & Infrastructure
  | 'foundations'
  | 'apis-communication'
  | 'databases-modeling'
  | 'data-stores'
  | 'scaling-performance'
  | 'reliability'
  | 'messaging'
  | 'networking'
  | 'security-auth'
  | 'delivery'
  // AI Engineering — every AI section is prefixed `ai-`; `sectionDomain` in
  // `src/lib/sections.ts` keys the home-page / sidebar domain split off that.
  | 'ai-llm-internals'
  | 'ai-reasoning'
  | 'ai-adaptation'
  | 'ai-retrieval'
  | 'ai-agents'
  | 'ai-orchestration'
  | 'ai-safety'
  | 'ai-evaluation'
  | 'ai-mlops';

/**
 * Controlled tag vocabulary. Tags are the multi-valued, cross-cutting axis
 * (they drive the home-page filter chips and tag-derived "Related"); a
 * closed union keeps the vocabulary from fragmenting into near-duplicates
 * (`api`/`apis`, `rag`/`retrieval`). Add a value here — deliberately —
 * before using it on an item; don't widen this back to `string`.
 *
 * Current vocabulary: `agents`, `ai`, `apis`, `auth`, `databases`,
 * `embeddings`, `evals`, `fine-tuning`, `git`, `guardrails`, `inference`,
 * `messaging`, `migrations`, `mlops`, `networking`, `patterns`,
 * `performance`, `process`, `prompting`, `rag`, `reliability`, `security`,
 * `testing`, `tooling`, `web`. The `ai` tag stays the broad marker for
 * AI-adjacent content; the finer AI tags below narrow it.
 */
export type Tag =
  | 'agents'
  | 'ai'
  | 'apis'
  | 'auth'
  | 'databases'
  | 'embeddings'
  | 'evals'
  | 'fine-tuning'
  | 'git'
  | 'guardrails'
  | 'inference'
  | 'messaging'
  | 'migrations'
  | 'mlops'
  | 'networking'
  | 'patterns'
  | 'performance'
  | 'process'
  | 'prompting'
  | 'rag'
  | 'reliability'
  | 'security'
  | 'testing'
  | 'tooling'
  | 'web';

export interface Nugget {
  id: string;
  title: string;
  /**
   * One plain-text sentence: what this item is *for* / when you'd reach for
   * it — not a definition. Shown on list cards and in search results. Keep it
   * to a sentence; it's a scannable hook, not an abstract.
   */
  summary: string;
  /** Markdown body. Fenced ```lang code blocks and ```mermaid diagrams render inline. */
  body: string;
  tags: Tag[];
  /** Topic section for nav grouping — one per item. See `Section` above. */
  section: Section;
  /**
   * 'nugget' — a short, single-concept write-up (pattern, gotcha, tradeoff).
   * 'guide' — a longer walkthrough/reference (e.g. onboarding to a tool,
   * a best-practices checklist) that doesn't fit the single-idea nugget shape.
   */
  format: 'nugget' | 'guide';
}
