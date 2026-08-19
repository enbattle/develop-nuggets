export interface Nugget {
  id: string;
  title: string;
  /** Markdown body. Fenced ```lang code blocks and ```mermaid diagrams render inline. */
  body: string;
  tags: string[];
  /**
   * 'nugget' — a short, single-concept write-up (pattern, gotcha, tradeoff).
   * 'guide' — a longer walkthrough/reference (e.g. onboarding to a tool,
   * a best-practices checklist) that doesn't fit the single-idea nugget shape.
   */
  format: 'nugget' | 'guide';
}
