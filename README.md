# Dev Nuggets

A personal, no-backend reference site for programming concepts worth
remembering — patterns, gotchas, short write-ups with code and diagrams.
It's a catalog to search and read, not a note-taking app: nuggets are
written into the codebase (like a small wiki), not created from the UI.

Built after learning the [expand-contract pattern](src/content/nuggets/expand-contract.md)
and wanting a well-designed place to write that kind of thing down for
later.

## Features

- **Search** — `Ctrl`/`Cmd` + `K` fuzzy-searches title, tags, and body
  ([Fuse.js](https://www.fusejs.io)).
- **Markdown content** — fenced code blocks are syntax-highlighted
  (via [Shiki](https://shiki.style)); ` ```mermaid ` fences render as diagrams
  (via [Mermaid](https://mermaid.js.org)).
- **Tags & updated dates** — every nugget carries tags (filterable from the
  home screen) and a last-updated date, so the catalog stays organized as it
  grows.
- **Related nuggets** — each nugget page links to others that share tags,
  computed automatically (no manual curation needed as the catalog grows).
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

## Adding a nugget

There's no in-app editor — nuggets are added as source files and shipped
with the next `npm run build`. See [CLAUDE.md](CLAUDE.md) for the exact
steps and the content architecture.
