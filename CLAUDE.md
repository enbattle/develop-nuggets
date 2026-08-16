# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev             # Start dev server
npm run build            # Type-check + production build → dist/
npm run preview          # Preview the production build locally
npm run lint             # ESLint on src/ (ts,tsx)
npm run format           # Prettier write on src/
npm run test             # Run tests in watch mode
npm run test:ui          # Run tests with Vitest UI
npm run test:run         # Run tests once (CI mode)
npm run test:coverage    # Run tests with coverage report
```

Always run `npm run build`, `npm run lint`, and `npm run test:run` before finalizing any task.

## What this app is

A read-only, no-backend catalog of short programming write-ups
("nuggets") — patterns, gotchas, concepts — searchable and taggable. It is
**not** a note-taking app: there is no in-browser create/edit/delete flow.
Content is authored as source files and ships with the build, the same way
`ai-cauldron`'s lesson modules work. See [README.md](README.md) for the
user-facing feature list.

The only thing persisted in the browser is *reading state* — which nugget
you last opened and how far you scrolled — not the content itself.

## Coding Standards

### General Principles

- **Search before writing**: grep for existing utilities before adding new
  ones. Extend what's already there rather than duplicating it.
- **Minimal surface area**: every export is a future maintenance burden. Add
  only what the task requires.
- **Honest naming**: names describe what a thing *is* or *does*, not how it
  came to exist. No `handle`, `helper`, `util`, `v2` suffixes.
- **No dead code**: remove commented-out blocks and unused imports
  immediately. Git history preserves anything worth keeping.
- **Content is not runtime state**: don't reintroduce a create/edit/delete
  UI, a `localStorage` nugget repository, or an export/import backup
  feature for nugget content. That was the original design and was
  deliberately replaced with static, source-authored content — see "Data
  model & content" below before adding anything that mutates a nugget at
  runtime.

### TypeScript

- Strict mode is enabled. Don't suppress errors with `any`, `@ts-ignore`, or
  unsafe casts — fix the type.
- Colocate types with the code they describe (`src/types.ts` is only for the
  one shared `Nugget` shape used across the whole app).

### React & components

- **Colocation**: keep state as close to where it's used as possible. There
  is no shared nugget state anymore — `NUGGETS` is a plain imported
  constant, not context. The one thing that *is* cross-cutting UI state is
  theme (`ThemeContext`).
- **Hooks for logic**: stateful/side-effectful logic lives in `src/hooks/`;
  components stay mostly JSX.
- **Lazy-load heavy content**: `LazyMarkdownRenderer` (Shiki + Mermaid) is
  `React.lazy`-loaded so the home list doesn't pay for it. Follow this
  pattern for any other genuinely heavy, not-always-needed view.

### Styling

- All colors/surfaces use the design-token CSS variables in
  `src/styles/globals.css` (`--color-bg-primary`, `--color-text-secondary`,
  etc.) — never hardcode hex values in components.
- Dark mode toggles the `dark` class on `<html>`, managed by
  `ThemeContext`. Test new UI in both themes.
- Tailwind utilities for layout/spacing/typography; `style={{}}` only for
  truly dynamic values.

### Error handling

- Don't swallow exceptions silently. `safeStorage` (see below) is the one
  deliberate exception — it degrades to a fallback rather than throwing,
  because a full page crash over an inaccessible `localStorage` (private
  browsing, quota) is worse than an app that just doesn't persist that
  write.

## Testing

Vitest + React Testing Library, jsdom environment.

- **File naming**: colocated `Component.test.tsx` / `module.test.ts`.
- **Custom render**: `src/test/utils.tsx` exports `render()`, wrapping
  components in `MemoryRouter` → `ThemeProvider`. Use it (not the raw RTL
  `render`) for anything that reads theme context or needs routing. It
  re-exports `screen`/`waitFor`/`within`/`fireEvent`/`cleanup` individually
  rather than `export *` — a wildcard re-export of `@testing-library/react`
  previously clobbered the local custom `render` via CJS interop, silently
  dropping the provider wrapper. Keep the named re-export list, don't switch
  it back to `export *`.
- **Setup**: `src/test/setup.ts` adds jest-dom matchers, clears
  `localStorage` after each test (reading-progress/theme state, not
  content), and mocks `matchMedia` / `IntersectionObserver` / `scrollTo`.
- **Content is real, not fixtures**: since `NUGGETS` is a static import,
  tests exercise the actual shipped content (`Expand-Contract Pattern`,
  `Idempotency`) rather than seeding fake data into storage. If you rename
  or remove a nugget referenced in a test (`HomePage.test.tsx`,
  `NuggetPage.test.tsx`, `App.test.tsx`), update the test alongside it.
- Prefer `screen.getByRole()` over test IDs. Test user-visible behavior.

## Architecture

### Data model & content

One entity, deliberately minimal (`src/types.ts`):

```ts
interface Nugget {
  id: string;
  title: string;
  body: string;       // markdown — fenced ```lang blocks and ```mermaid diagrams render inline
  tags: string[];
  updatedAt: string;  // ISO date, set by whoever authors/updates the file
}
```

Nuggets live in `src/content/nuggets/`, one markdown file + one metadata
file per nugget:

```
src/content/nuggets/
  expand-contract.md      # prose, fenced code, mermaid — pure markdown
  expand-contract.ts       # metadata, body imported from the .md via `?raw`
  idempotency.md
  idempotency.ts
  exponential-backoff.md
  exponential-backoff.ts
  outbox-pattern.md
  outbox-pattern.ts
  n-plus-one-queries.md
  n-plus-one-queries.ts
  circuit-breaker.md
  circuit-breaker.ts
  index.ts                  # NUGGETS: Nugget[] — the registry every page reads from
```

**Adding a nugget:**

1. Write `src/content/nuggets/<slug>.md` — pure markdown, no frontmatter.
   Cross-reference other nuggets inline with a normal markdown link to
   their route, e.g. `[idempotent](/nuggets/idempotency)` —
   `MarkdownRenderer` routes any `href` starting with `/` through
   `react-router`'s `Link` so it navigates client-side instead of doing a
   full page reload.
2. Create `src/content/nuggets/<slug>.ts`:
   ```ts
   import body from './<slug>.md?raw';
   import type { Nugget } from '@/types';

   export const mySlug: Nugget = {
     id: '<slug>',
     title: 'My Title',
     tags: ['some', 'tags'],
     updatedAt: '2026-01-01',
     body,
   };
   ```
   Reuse existing tags where they genuinely fit (`reliability`, `patterns`,
   `apis`, `migrations`, `databases`, `performance`, `messaging`) rather
   than inventing near-duplicates — the tag vocabulary is what drives both
   the home page's filter chips and the "Related" section (see below), so
   a fragmented vocabulary weakens both.
3. Import it and add it to the `NUGGETS` array in
   `src/content/nuggets/index.ts`.

Body content is kept in a separate `.md` file (imported via Vite's `?raw`
suffix) rather than a JS template literal — a markdown body containing
fenced code blocks has literal backtick characters in it, which would
prematurely terminate a template literal string unless escaped. `?raw`
avoids that entirely.

### Related nuggets

`getRelatedNuggets` (`src/lib/related.ts`) ranks every other nugget by
number of shared tags with the current one (ties broken by most recently
updated) and returns the top 3. `NuggetPage` renders those as a "Related"
section below the content. This is entirely tag-derived — there's no
per-nugget `related: [...]` field to maintain, so any new nugget
participates automatically as long as its tags overlap with something
else's. If a nugget's related section looks wrong or empty, the fix is
almost always to its `tags`, not to `related.ts`.

### Reading state

`src/lib/safeStorage.ts` is a try/catch `localStorage` wrapper that returns
a fallback instead of throwing (private browsing, quota-exceeded, storage
disabled). It backs two independent, unrelated concerns:

- `ThemeContext.tsx` — the dark/light preference
- `src/lib/readingProgress.ts` — last-viewed nugget id + a per-nugget
  scroll offset, consumed by `useRecordReadingProgress` (restores/persists
  scroll from `NuggetPage`) and `useLastViewedNugget` (feeds the "Continue
  reading" banner on `HomePage`), both in
  `src/hooks/useContinueReading.ts`.

Neither of these stores nugget content — only reading state. There is no
repository/CRUD layer for nuggets; components read `NUGGETS`/`getNugget()`
directly from `src/content/nuggets/index.ts`.

### Markdown & diagram rendering

`MarkdownRenderer` (`src/components/MarkdownRenderer.tsx`) renders a
nugget's `body` via `react-markdown` + `remark-gfm`, with a custom `a`
renderer (internal `/...` links use `react-router`'s `Link`, everything
else opens in a new tab) and a custom `code` renderer that routes to:

- `CodeBlock` — Shiki-highlighted (`shiki`'s `codeToHtml`, async, themed
  `github-dark`/`github-light` to match the app's dark/light mode)
- `MermaidDiagram` — for ` ```mermaid ` fences, via `mermaid.render()`
  (`securityLevel: 'strict'`)

Both pull in real weight (Shiki grammars, Mermaid's diagram engines), so
`MarkdownRenderer` is only ever consumed through `LazyMarkdownRenderer`
(`React.lazy` + `Suspense`), used by `NuggetPage`. Import
`LazyMarkdownRenderer`, not `MarkdownRenderer` directly, from any new call
site.

### Keyboard shortcuts

- `Ctrl`/`Cmd` + `K` — focus the header search bar

Wired in `useGlobalShortcuts` (`src/hooks/useGlobalShortcuts.ts`), called
from `AppShell` in `App.tsx`.

### Routing

Two routes (`src/App.tsx`):

- `/` — `HomePage`: continue-reading banner, tag filter chips, nugget list
  (sorted by `updatedAt`)
- `/nuggets/:id` — `NuggetPage`: rendered nugget content

`Header` (search, theme toggle) is rendered once in `AppShell`, above the
routed content, so it's present on every page.

### Path alias

`@/` resolves to `src/` (configured in both `vite.config.ts` and
`tsconfig.app.json`).
