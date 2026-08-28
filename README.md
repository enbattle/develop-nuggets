# Dev Nuggets

A personal, no-backend reference site for programming concepts worth
remembering — patterns, gotchas, short write-ups with code and
diagrams, plus longer-form guides for topics that need more room
(technology primers, walkthroughs, best-practices checklists). Everything
is organized into topic sections to browse and search — it's a reference
to read, not a note-taking app: content is written into the codebase
(like a small wiki), not created from the UI.

Built after learning the [expand-contract pattern](src/content/nuggets/expand-contract.md)
and wanting a well-designed place to write that kind of thing down for
later.

## Features

- **Topic sections** — every nugget and guide is filed under one topic
  section (Foundations, APIs & Communication, Data Stores, Reliability &
  Resilience, Security & Auth, …), each with a one-line charter, so the
  catalog reads as an organized shelf rather than a flat list.
- **Search** — `Ctrl`/`Cmd` + `K` fuzzy-searches title, tags, and body
  ([Fuse.js](https://www.fusejs.io)) across nuggets and guides together,
  each result showing its format, section, and one-line summary.
- **Markdown content** — fenced code blocks are syntax-highlighted
  (via [Shiki](https://shiki.style)) with a copy button; ` ```mermaid `
  fences render as diagrams (via [Mermaid](https://mermaid.js.org)).
- **Tags** — every nugget and guide also carries cross-cutting tags,
  filterable from the home screen and used to compute related content.
- **Related content** — each page links to others that share tags
  (computed automatically), plus prev/next links to read through the rest
  of its section in order.
- **Home screen** — the whole catalog laid out by topic section, with a
  format filter (All / Nuggets / Guides) and tag chips; each card shows a
  one-sentence summary of what the item is for.
- **Sidebar navigation** — the same sections as a collapsible outline,
  starting collapsed so it reads as a table of contents; open an item and
  its section expands automatically. Stays in view while you scroll;
  collapses to a drawer on mobile.
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
