/**
 * The one topic section an item is filed under — its "home shelf" in the
 * sidebar and on the home page. Exactly one per item, authored by hand.
 * Distinct from `tags`: tags are multi-valued and cross-cutting (and drive
 * "Related"), `section` is the single place a thing lives in the nav. See
 * `src/lib/sections.ts` for labels, charters, and display order.
 */
export type Section =
  | 'foundations'
  | 'apis-communication'
  | 'databases-modeling'
  | 'data-stores'
  | 'scaling-performance'
  | 'reliability'
  | 'messaging'
  | 'networking'
  | 'security-auth'
  | 'delivery';

/**
 * Controlled tag vocabulary. Tags are the multi-valued, cross-cutting axis
 * (they drive the home-page filter chips and tag-derived "Related"); a
 * closed union keeps the vocabulary from fragmenting into near-duplicates
 * (`api`/`apis`, `auth`/`authentication`). Add a value here — deliberately —
 * before using it on an item; don't widen this back to `string`.
 */
export type Tag =
  | 'ai'
  | 'apis'
  | 'auth'
  | 'databases'
  | 'git'
  | 'messaging'
  | 'migrations'
  | 'networking'
  | 'patterns'
  | 'performance'
  | 'process'
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
