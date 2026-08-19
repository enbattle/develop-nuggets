# Dev Nuggets

A personal, no-backend reference site for programming concepts worth
remembering — patterns, gotchas, short write-ups with code and
diagrams, plus longer-form guides for topics that need more room
(technology primers, walkthroughs, best-practices checklists). It's a
catalog to search and read, not a note-taking app: content is written
into the codebase (like a small wiki), not created from the UI.

Built after learning the [expand-contract pattern](src/content/nuggets/expand-contract.md)
and wanting a well-designed place to write that kind of thing down for
later.

## Features

- **Search** — `Ctrl`/`Cmd` + `K` fuzzy-searches title, tags, and body
  ([Fuse.js](https://www.fusejs.io)) across nuggets and guides together,
  each result tagged with its format.
- **Markdown content** — fenced code blocks are syntax-highlighted
  (via [Shiki](https://shiki.style)); ` ```mermaid ` fences render as diagrams
  (via [Mermaid](https://mermaid.js.org)).
- **Tags** — every nugget and guide carries tags, filterable per tab from
  the home screen, so the catalog stays organized as it grows.
- **Related content** — each page links to others that share tags,
  computed automatically (no manual curation needed as the catalog grows).
- **Home screen tabs** — Nuggets and Guides each get their own tab, tag
  filter chips, and pagination (10 at a time, with "Load more"); switching
  tabs starts that tab fresh (no filter carried over from the other one).
- **Sidebar navigation** — guides, then every nugget, each listed
  alphabetically within a collapsible section (collapse the ones you're
  not using), always available for quick lookup (stays in view while you
  scroll; collapses to a drawer on mobile).
- **Continue reading** — the home screen resumes at whatever you were last
  reading, scroll position included. This is the only thing stored in the
  browser — the content itself ships with the app.
- **Dark / light mode** — follows your system preference by default,
  toggleable.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed `localhost` URL.

## Commands

```bash
npm run dev             # Start the dev server
npm run build            # Type-check + production build → dist/
npm run preview          # Preview the production build locally
npm run lint             # ESLint on src/
npm run format           # Prettier write on src/
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with the Vitest UI
npm run test:run         # Run tests once (CI mode)
npm run test:coverage    # Run tests with a coverage report
```

## Adding a nugget or guide

There's no in-app editor — content is added as source files and shipped
with the next `npm run build`. See [CLAUDE.md](CLAUDE.md) for the exact
steps, the content architecture, and when a topic should be a nugget vs.
a guide.
