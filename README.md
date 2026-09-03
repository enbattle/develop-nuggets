# Dev Nuggets

A personal, no-backend engineering reference. Two domains — **Systems &
Infrastructure** (backend, data, APIs, networking, reliability) and **AI
Engineering** (LLM internals, retrieval, agents, evaluation, MLOps) — as
short **nuggets** (patterns, gotchas, one-idea write-ups) and longer
**guides** (primers, walkthroughs, checklists), organized into topic
sections to browse and search. It's a reference to read, not a note-taking
app: content is written into the codebase, not created from the UI.

Built after learning the [expand-contract pattern](src/content/nuggets/expand-contract.md)
and wanting a well-designed place to write that kind of thing down for
later; the AI-engineering half was merged in from the former `ai-cauldron`
project.

## Features

- **Two domains** — a Systems / AI toggle on the home page and a matching
  split in the sidebar; each item is filed under one topic section
  (Foundations, Data Stores, Retrieval & RAG, Agents, …) with a one-line
  charter.
- **Tracks** — ordered reading paths through the AI guides (Retrieval,
  Agents, Evaluation, …). Each has a syllabus page with a progress bar;
  within a track the prev/next pager follows track order and you can mark
  items complete.
- **Interactive RAG algorithms** — `/interactive` has step-through pages
  for ten retrieval patterns: four you step through a pipeline diagram
  one stage at a time (Agentic, Self-RAG, Corrective, GraphRAG), six as
  static diagram-plus-code summaries. Lazy-loaded.
- **Search** — `Ctrl`/`Cmd` + `K` fuzzy-searches title, tags, and body
  ([Fuse.js](https://www.fusejs.io)) across everything, each result
  showing its format, section, and one-line summary.
- **Markdown content** — fenced code blocks are syntax-highlighted
  (via [Shiki](https://shiki.style)) with a copy button; ` ```mermaid `
  fences render as diagrams (via [Mermaid](https://mermaid.js.org)); long
  guides get an on-page table of contents.
- **Tags & related content** — cross-cutting tags filter the home screen
  and compute the "Related" list on each page.
- **Keyboard nav** — `Ctrl`/`Cmd`+`K` search, `?` for the shortcut list,
  `j` / `k` to move through a section or track.
- **Continue reading** — the home screen resumes at your last item and
  scroll position, and offers to resume the last track. Reading state is
  the only thing stored in the browser.
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

## Adding content

There's no in-app editor — nuggets, guides, and tracks are added as source
files and shipped with the next `npm run build`. See [CLAUDE.md](CLAUDE.md)
for the exact steps, the content architecture (including where AI-domain
guides and tracks live), and when a topic should be a nugget vs. a guide.

## Design

The UI is held to the [Laws of UX](https://lawsofux.com) — navigation is
the product at this catalog size. See [docs/DESIGN.md](docs/DESIGN.md) for
the full rubric and per-surface checklists.
