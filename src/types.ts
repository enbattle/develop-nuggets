export interface Nugget {
  id: string;
  title: string;
  /** Markdown body. Fenced ```lang code blocks and ```mermaid diagrams render inline. */
  body: string;
  tags: string[];
}
