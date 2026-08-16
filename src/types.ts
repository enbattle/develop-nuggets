export interface Nugget {
  id: string;
  title: string;
  /** Markdown body. Fenced ```lang code blocks and ```mermaid diagrams render inline. */
  body: string;
  tags: string[];
  /** ISO date — set by whoever authors/updates the nugget's source file. */
  updatedAt: string;
}
