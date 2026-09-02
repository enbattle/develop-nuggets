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

A read-only, no-backend engineering reference. It spans two **domains** —
**Systems & Infrastructure** (the original catalog: backend, data, APIs,
networking, reliability) and **AI Engineering** (LLM internals, retrieval,
agents, evaluation, MLOps — migrated in from the former `ai-cauldron`
project). Both are the same two content shapes:

- **nuggets** — short, single-concept write-ups (patterns, gotchas,
  tradeoffs), searchable and taggable.
- **guides** — longer walkthroughs / best-practices references for topics
  that don't compress into one idea.

On top of those sit two navigation layers:

- **tracks** — ordered reading paths through a set of guides (one per AI
  topic; see "Tracks" below). A curation layer, *not* a third `format`.
- **interactive** — `/interactive/:id` step-through pages for the ten RAG
  algorithms (4 stepped, 6 static summaries). Lazy-loaded; see
  "Interactive algorithm pages".

It is **not** a note-taking app: no in-browser create/edit/delete. Content
is authored as source files and ships with the build. See
[README.md](README.md) for the user-facing feature list.

The only thing persisted in the browser is *reading state* — last item +
scroll offset, and per-item track completion — never the content itself.

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
- **Content is real, not fixtures**: since `NUGGETS`/`GUIDES` are static
  imports, tests exercise the actual shipped content (`Expand-Contract
  Pattern`, `Idempotency`) rather than seeding fake data into storage. If
  you rename or remove a nugget or guide referenced in a test
  (`HomePage.test.tsx`, `ContentPage.test.tsx`, `App.test.tsx`), update the
  test alongside it — and `src/content/links.test.ts` fails if a renamed
  slug leaves a dangling `](/nuggets/…)` link in any body.
- Prefer `screen.getByRole()` over test IDs. Test user-visible behavior.

## Architecture

### Data model & content

One shape, deliberately minimal (`src/types.ts`):

```ts
interface Nugget {
  id: string;
  title: string;
  summary: string;  // one plain-text sentence — what it's *for*, shown on cards + search
  body: string;  // markdown — fenced ```lang blocks and ```mermaid diagrams render inline
  tags: string[];
  section: Section;  // the one topic section it's filed under — see below
  format: 'nugget' | 'guide';
}
```

No dates — no `createdAt`/`updatedAt`. There's no reader-facing use for them
(the app has no notion of "new since you last visited"), and they'd be
authored by hand anyway with no way to guarantee they're accurate, so they'd
just be a maintenance cost with no real payoff. If a genuine need for
ordering-by-recency shows up later, reconsider then — don't re-add "just in
case."

**`format` distinguishes two shapes of content, not two topics** (that's
what `tags` is for):

- `'nugget'` — a short, single-concept write-up: a pattern, gotcha, or
  tradeoff, meant to be read in a couple of minutes and remembered. Most of
  the catalog is this.
- `'guide'` — a longer walkthrough or best-practices reference (getting set
  up with a tool, a checklist for a whole subsystem) that doesn't compress
  into one idea. Use this sparingly — most new content should still be a
  nugget; reach for `guide` only when the topic is genuinely a multi-section
  reference, not just "a nugget I want to write more words in."

Anywhere the UI needs to show a format as a label (the badge in
`SearchBar`'s results dropdown) or route to it (`contentPath()` in
`src/content/index.ts`), it goes through a `Record` keyed by the
`format` union — `FORMAT_LABELS` in `src/lib/format.ts` for display
labels — not a per-format `if`/ternary scattered at each call site.
TypeScript then forces every one of those `Record`s to be updated the
moment a new format is added to the union, instead of a new format
silently missing a label somewhere. Add a new mapping here, don't
inline another format check next to an existing one.

**`section` — the one topic shelf, distinct from `tags`.** Every item is
filed under exactly one `Section` (`src/types.ts`), and that's what the
sidebar and the home page group by. This is deliberately *not* a "primary
tag": `tags` stays multi-valued and cross-cutting (it drives the tag
filter chips and "Related"), while `section` is the single, hand-curated
place a thing lives in the nav — the answer to "where would someone
*browse* for this." An item that's genuinely dual-topic (Idempotency is
API + reliability) still picks one section; `tags` and "Related" carry the
rest. `src/lib/sections.ts` holds three `Record`/array constants keyed by
the `Section` union — `SECTION_LABELS` (heading text), `SECTION_DESCRIPTIONS`
(the one-line charter shown under each heading on the home page), and
`SECTION_ORDER` (display order, deliberately not alphabetical) — same
exhaustiveness rationale as `FORMAT_LABELS`. `contentBySection()` in
`src/content/index.ts` is the one place that groups `CONTENT` by section
(guides before nuggets, alphabetical within, empty sections dropped); the
sidebar and home page both render through it. A test in
`src/content/index.test.ts` fails if any item lands in an unknown section
or any section ends up empty.

**`summary` — a scannable one-liner, not a definition.** One plain-text
sentence per item, framed as what it's *for* / when you'd reach for it.
It's rendered on the home-page cards and in the search dropdown in place of
an auto-generated body excerpt (there is no `excerpt()` util anymore).
Keep it to a sentence; a test enforces that it's non-empty.

**`tags` — a closed `Tag` union, not `string[]`.** The vocabulary lives in
`src/types.ts` as a union type (`'apis' | 'auth' | 'databases' | …`), so a
typo or near-duplicate (`api` vs `apis`) is a compile error rather than a
silently fragmented filter set. Adding a tag is a deliberate edit to that
union; don't widen it back to `string`. Same "controlled by the type
system" treatment `Section` and `format` already get.

Nuggets and guides each live in their own content directory, same
`.md` + `.ts` pair shape:

```
src/content/
  nuggets/
    expand-contract.md   # prose, fenced code, mermaid — pure markdown
    expand-contract.ts    # metadata (format: 'nugget'), body imported via `?raw`
    idempotency.md
    idempotency.ts
    ...                     # one .md + .ts pair per nugget, same shape
    index.ts               # NUGGETS: Nugget[]
  guides/
    <slug>.md              # Systems-domain guides: flat in guides/
    <slug>.ts                # metadata (format: 'guide'), same shape as a nugget's
    ai/                     # AI-domain guides, one subdir per AI section
      retrieval/
        <slug>.md
        <slug>.ts
        index.ts           # AI_RETRIEVAL: Nugget[]
      agents/ …            # llm-internals, reasoning, adaptation, retrieval,
      …                     #   agents, orchestration, safety, evaluation, mlops
    index.ts               # GUIDES: Nugget[] = [...flat guides, ...AI_* arrays]
  tracks.ts               # TRACKS: Track[] — ordered reading paths (see "Tracks")
  index.ts                 # CONTENT: Nugget[] = [...NUGGETS, ...GUIDES]
                            # getContent(id), contentPath(item), sectionNeighbors,
                            # trackNeighbors — everything that looks up or links to
                            # *either* format reads through this file.
```

Every content `id` is unique across nuggets **and** guides (they share the
`getContent` namespace and the `/nuggets` vs `/guides` routing only differs
by prefix). When migrating or adding AI guides, check the id doesn't
collide with an existing systems item — `vector-databases` (systems nugget)
vs `vector-search` (RAG guide) is the one case that was renamed to avoid it.

**Guide titles: the `Topic: Subtopic` convention.** Some guides share a
title prefix (`Networking: Protocols`, `Networking: Load Balancing`,
`Networking: Real-Time Communication`, `Networking: CDN`; `APIs: Best
Practices`, `APIs: REST vs. GraphQL vs. gRPC`, `APIs: Gateway`) — that
prefix means "this guide is one chapter of a single subject too big for
one page," not "this guide is loosely related to other things tagged
the same way." Use it when a new guide is genuinely another chapter of
an *existing* multi-guide family. Don't use it for a technology
primer — `Redis`, `Kafka`, `Elasticsearch`, `Relational Databases`,
`DynamoDB & Cassandra`, `Serverless & AWS Lambda` are each "here's what
this specific product is," and prefixing them with their domain
(`Databases: Redis`) wouldn't disambiguate anything the name doesn't
already say — the prefix has to be doing real disambiguation work to
earn its place, not just restating the tag. This is a **guides-only**
convention; don't apply it to nuggets — a nugget's whole value is being
atomic and instantly recognizable by its own name (`Circuit Breaker`,
not `Resilience Patterns: Circuit Breaker`), and `tags` (see "Reuse
existing tags" below) already do that grouping work for nuggets without
sacrificing standalone recall. It's a separate convention from `X vs.
Y` (`SQL vs. NoSQL`, `Partitioning vs. Sharding`), which is for
disambiguating two commonly-confused terms as equals, not splitting one
topic into parts — both conventions coexist and shouldn't be mixed
(don't write `Networking: X vs. Y`).

**Adding a nugget:**

1. Write `src/content/nuggets/<slug>.md` — pure markdown, no frontmatter.
   Cross-reference other nuggets or guides inline with a normal markdown
   link to their route, e.g. `[idempotent](/nuggets/idempotency)` or
   `[the API guide](/guides/api-best-practices)` — `MarkdownRenderer` routes
   any `href` starting with `/` through `react-router`'s `Link` so it
   navigates client-side instead of doing a full page reload.
2. Create `src/content/nuggets/<slug>.ts`:
   ```ts
   import body from './<slug>.md?raw';
   import type { Nugget } from '@/types';

   export const mySlug: Nugget = {
     id: '<slug>',
     title: 'My Title',
     summary: 'One sentence on what this is for — not a definition.',
     tags: ['some', 'tags'],
     section: 'reliability',
     body,
     format: 'nugget',
   };
   ```
   Pick the one `section` (from the `Section` union in `src/types.ts`) a
   reader would *browse* for this under — see "the one topic shelf" above;
   if it's a toss-up, `tags` and "Related" cover the other angle. Tags come
   from the `Tag` union in `src/types.ts` (the source is the authority —
   currently the 16 systems tags plus `rag`, `agents`, `evals`, `prompting`,
   `inference`, `fine-tuning`, `guardrails`, `mlops`, `embeddings`) —
   TypeScript rejects anything else. Reuse a fitting
   existing tag rather than adding a near-duplicate to the union; the tag
   vocabulary drives both the home page's filter chips and the "Related"
   section (see below), so a fragmented vocabulary weakens both.
3. Import it and add it to the `NUGGETS` array in
   `src/content/nuggets/index.ts`.

**Adding a guide:** same three steps (including `summary` and `section`),
with `format: 'guide'`. A **Systems** guide goes flat in
`src/content/guides/` and is added to the `GUIDES` array in
`src/content/guides/index.ts`. An **AI** guide goes in
`src/content/guides/ai/<section>/` and is added to that section's local
array (`AI_RETRIEVAL`, `AI_AGENTS`, …), which is already spread into
`GUIDES`; if it belongs in a track, also add its id to that track's
`items` in `src/content/tracks.ts`. No other wiring is needed — `CONTENT`,
routing, search, sidebar, related, and tracks are all format- and
section-aware.

The `Section` union (`src/types.ts`) has two families: 10 systems sections
and 9 AI sections, each prefixed `ai-` (`ai-llm-internals`, `ai-reasoning`,
`ai-adaptation`, `ai-retrieval`, `ai-agents`, `ai-orchestration`,
`ai-safety`, `ai-evaluation`, `ai-mlops`). The `ai-` prefix is load-bearing
— `sectionDomain()` keys the home-page domain filter and sidebar
super-grouping off it. `Tag` gained `rag`, `agents`, `evals`, `prompting`,
`inference`, `fine-tuning`, `guardrails`, `mlops`, `embeddings` for the AI
content.

Body content is kept in a separate `.md` file (imported via Vite's `?raw`
suffix) rather than a JS template literal — a markdown body containing
fenced code blocks has literal backtick characters in it, which would
prematurely terminate a template literal string unless escaped. `?raw`
avoids that entirely.

### Related content, and section prev/next

`ContentPage` has two navigation aids below the body; they're different
things:

- **"Related"** — `getRelatedNuggets` (`src/lib/related.ts`) ranks every
  other item (nuggets and guides both, format-agnostic) by number of
  shared tags (ties broken alphabetically) and returns the top 3. Entirely
  tag-derived — no per-item `related: [...]` field — so anything new
  participates automatically once its tags overlap. If a related section
  looks wrong or empty, fix the item's `tags`, not `related.ts`.
- **Prev/next pager** — `sectionNeighbors(item)` (`src/content/index.ts`)
  returns the items immediately before and after this one *within its own
  section*, in the order `contentBySection()` produces (guides before
  nuggets, alphabetical); `null` at either end. It's the "read this
  section in order" affordance, derived purely from `section` + title.

The header also shows the section label as a plain eyebrow (not a link —
there's no per-section page; the home page is where sections are browsed).

### Reading state

`src/lib/safeStorage.ts` is a try/catch `localStorage` wrapper that returns
a fallback instead of throwing (private browsing, quota-exceeded, storage
disabled). It backs two independent, unrelated concerns:

- `ThemeContext.tsx` — the dark/light preference
- `src/lib/readingProgress.ts` — last-viewed item id + a per-item
  scroll offset, consumed by `useRecordReadingProgress` (restores/persists
  scroll from `ContentPage`) and `useLastViewedNugget` (feeds the "Continue
  reading" banner on `HomePage`), both in
  `src/hooks/useContinueReading.ts`.

Neither of these stores content — only reading state. There is no
repository/CRUD layer for nuggets or guides; components read
`CONTENT`/`getContent()`/`contentPath()`/`contentBySection()` from
`src/content/index.ts`. The per-format `NUGGETS`/`GUIDES` arrays exist only
to build the merged `CONTENT` (and as test fixtures); no component imports
them directly anymore — a format-scoped view is a `.filter()` on `CONTENT`,
and a section-grouped view goes through `contentBySection()`.

### Markdown & diagram rendering

`MarkdownRenderer` (`src/components/MarkdownRenderer.tsx`) renders a
nugget's `body` via `react-markdown` + `remark-gfm`, with a custom `a`
renderer (internal `/...` links use `react-router`'s `Link`, everything
else opens in a new tab) and a custom `code` renderer that routes to:

- `CodeBlock` — Shiki-highlighted, async, themed `github-dark`/`github-light`
  to match the app's dark/light mode. It does *not* import the `shiki`
  bundled entrypoint (that pulls every grammar). Instead it lazy-`import()`s
  `shiki/core`, the JS regex engine (no Oniguruma WASM), the two themes, and
  one grammar per language on first use — `LANGUAGE_LOADERS` is an explicit
  language→loader allowlist. A fence in a language not in the map renders as
  a plain `<pre>`; add a loader entry when content starts using a new
  language. Every block is wrapped by `CodeShell`, which adds the
  hover-revealed **Copy** button.
- `MermaidDiagram` — for ` ```mermaid ` fences, via `mermaid.render()`
  (`securityLevel: 'strict'`)

Both still pull real weight (grammars, Mermaid's diagram engines), so
`MarkdownRenderer` is only ever consumed through `LazyMarkdownRenderer`
(`React.lazy` + `Suspense`), used by `ContentPage`. Import
`LazyMarkdownRenderer`, not `MarkdownRenderer` directly, from any new call
site.

### Keyboard shortcuts

- `Ctrl`/`Cmd` + `K` — focus the header search bar
- `?` — open the keyboard-shortcuts modal (`KeyboardShortcutsModal`)
- `j` / `k` — on a content page, go to the next / previous item; follows
  **track order** when the item is in a track (`trackNeighbors`), else
  section order (`sectionNeighbors`). Ignored while a modal is open or
  focus is in an input.

Wired in `useGlobalShortcuts` (`src/hooks/useGlobalShortcuts.ts`), called
from `AppShell` in `App.tsx`; it returns `{ shortcutsOpen, closeShortcuts }`
for the modal.

### Routing

Routes (`src/App.tsx`):

- `/` — `HomePage`: continue-reading banner, a **domain filter** (Systems /
  AI), a format filter (`All`/`Nuggets`/`Guides`), tag chips, then the
  active domain's catalog as topic-section blocks (see "Home page" below).
- `/nuggets/:id` and `/guides/:id` — both render `ContentPage`, resolving
  `:id` through `getContent()` and rendering identically. Use
  `contentPath(item)` (from `@/content`) rather than hand-building the
  path — it picks the prefix from `item.format`.
- `/tracks/:id` — `TrackPage`: a track's syllabus + progress (see
  "Tracks").
- `/interactive` and `/interactive/:id` — `InteractivePage`, **`React.lazy`**
  (keeps the RAG-viz weight out of the main chunk). See "Interactive
  algorithm pages".

`Header` (search, theme toggle) is rendered once in `AppShell`, above the
routed content, so it's present on every page.

### Tracks

A **track** (`src/content/tracks.ts`) is an ordered reading path through a
set of existing guides — one per AI topic, 1:1 with the old ai-cauldron
modules. It is a *curation layer*, deliberately **not** a third `format`:
`Nugget`/`format` are unchanged, guides stay guides, and a guide can exist
without being in any track.

```ts
interface Track { id; title; summary; section: Section; items: string[]; }
export const TRACKS: Track[];
export function getTrack(id): Track | undefined;
export function trackForItem(contentId): Track | undefined; // first track listing it
```

- `items` is an ordered list of content ids. An id that doesn't resolve
  renders as a disabled "Coming soon" row and is skipped for
  neighbour/progress math (so a track can reference content before it lands).
- `trackNeighbors(item)` in `src/content/index.ts` mirrors
  `sectionNeighbors` but walks the item's track order; `ContentPage`'s
  prev/next pager uses it when `trackForItem(item.id)` is set, and shows a
  `Track: <title>` eyebrow linking to `/tracks/:id`.
- **Progress** is `src/lib/trackProgress.ts` — a `safeStorage`-backed
  per-item completion map (`dn:track-progress`) plus a last-engaged track
  id (`dn:track-progress:last`). `useTrackProgress()` exposes it
  reactively; `ContentPage` shows a "Mark complete" toggle for tracked
  items; `TrackPage` shows a progress bar; `useResumeTrack()`
  (`useContinueReading.ts`) feeds a "Resume" affordance.

**Adding / editing a track:** edit `TRACKS` in `src/content/tracks.ts` —
`id` (URL slug), `title`, one-sentence `summary`, `section` (the AI
`Section` its guides live under), and `items` in reading order.
`src/content/tracks.test.ts` checks ids are unique and sections are real.

### Interactive algorithm pages

`/interactive/:id` renders one of the ten RAG algorithms via
`src/components/interactive/`. Everything here is behind `React.lazy` and
split into its own chunks — the Systems side of the app never loads it.

- `registry.ts` — `INTERACTIVE: InteractiveEntry[]` (id, name, `kind:
  'stepper' | 'summary'`, blurb, lazy `load`) + `getInteractive(id)`. The
  four loop-structured algorithms (`agentic`, `self-rag`, `corrective`,
  `graph`) are `stepper`; the other six are `summary`.
- `StepThrough.tsx` — the reusable walkthrough: prev/next + `←`/`→`/`R`
  keys, a step counter, and per-step highlighting of a static SVG/Mermaid
  diagram. **No `framer-motion`, no SMIL** — the ai-cauldron animation
  engine was deliberately dropped; progression is conveyed by
  `.is-active`/`.is-visited` class toggles.
- `pipeline.ts` / `PipelineFigure.tsx` — static SVG pipeline diagrams
  (ported geometry, no traveling packets). `figures/` holds the static
  `EmbeddingSpace` / `KnowledgeGraph` / `ReActTrace` reductions.
- Per-algorithm dirs (`standard/`, `agentic/`, …) each export a `default`
  component; Python from ai-cauldron's `code-snippet.ts` is carried into
  `CodeTabs` (via the existing `CodeBlock`).

Guides link to these with a normal internal link, e.g.
`[step through it](/interactive/standard)`; `links.test.ts` validates
those against the registry.

### Sidebar

`Sidebar` (`src/components/Sidebar.tsx`) groups content by `section` — the
topic sections in `SECTION_ORDER`, via `contentBySection()` — with
guides before nuggets within each and a small "Guide" badge on the guides.
It is *not* grouped by tag: tags are multi-valued (an item can be both
`reliability` and `patterns`), so a tag-grouped sidebar would mean either
duplicating entries or inventing a "primary tag" — `section` is the
single-valued axis that already exists for exactly this. The sidebar's job
is fast lookup and orientation by topic from any page; free-text lookup by
name is what `Ctrl`/`Cmd`+`K` search is for.

Sections are wrapped in **two domain groups** (`DOMAIN_ORDER` →
`DOMAIN_LABELS` from `@/lib/sections`: Systems & Infrastructure, AI
Engineering), each a collapsible `<h2><button aria-expanded>` that is
**expanded by default** and force-opens (never auto-closes) when you
navigate into one of its sections. `sectionDomain(section)` (`'ai'` iff the
value is prefixed `ai-`) is the split.

Each section group is a `SidebarGroup` (a local component inside
`Sidebar.tsx`, not its own file — not reused elsewhere) with its own
collapsed/expanded `useState`. **Collapsed by default**, so the sidebar
opens as a scannable list of section names; the section holding the current
route's item starts expanded (`useActiveSection()` parses the id out of the
pathname and looks up its section). A small `useEffect` re-opens a section when you
navigate into it (e.g. via a "Related" link) but never auto-*closes* one
the reader opened — it only ever sets `open` true. The heading is a
`<button aria-expanded>` wrapped in an `<h2>` (the WAI-ARIA accordion
pattern — a screen reader gets heading navigation via the `h2`, the
`button` carries the disclosure semantics), so `getByRole('heading', ...)`
and `getByRole('button', ...)` both resolve to it. Headings render once
there's more than one non-empty group (`SECTIONS.length > 1`, where
`SECTIONS = contentBySection()` already drops empty ones) — with this many
sections that's always true in practice, but the guard stays generic.

Topic links are indented further than their group heading (`pl-6` vs.
the heading's `px-3`) so they read as nested under it, not flush with
it — the link element itself still spans the full row width, so the
hover/active background isn't affected, only the text's start position.

Desktop and the mobile drawer are two separate `Sidebar` instances (see
below), so their collapsed states are independent — collapsing a section
on desktop doesn't collapse it in the drawer.

`AppShell` renders two copies of it: a static one in a `hidden md:block`
`<aside>` for desktop, and a second one inside a fixed-overlay drawer
(`role="dialog"`, `aria-label="All content"`) toggled by the hamburger
button in `Header` (`aria-label="Toggle navigation"`), for viewports below
`md`. Both read the same module-level `SECTIONS = contentBySection()`
grouping — there's no prop threading data into either. The drawer closes on
backdrop click, `Escape`, or clicking a link (`Sidebar`'s `onNavigate`
prop).

The desktop `<aside>` is `sticky top-16` with its own `max-h-[calc(100vh-4rem)]`
and `overflow-y-auto`, plus `self-start` so it doesn't stretch to match
`<main>`'s height (which would leave nothing for `sticky` to stick
within). `top-16`/`4rem` matches `Header`'s rendered height — if `Header`'s
height ever changes, update both to match, or the sidebar will either gap
below the header or tuck under it. The effect: the sidebar stays pinned
in the viewport while the article scrolls, and only scrolls internally
once its own content (dozens of nuggets plus a growing set of guides)
exceeds the viewport height.

### Home page: sections + filters

`HomePage` stacks the active domain's catalog as topic-section blocks —
heading + one-line charter (`SECTION_LABELS`/`SECTION_DESCRIPTIONS`) + the
section's cards — rendered by `SectionedContentList`
(`src/components/SectionedContentList.tsx`), which just groups an
already-filtered `Nugget[]` through `contentBySection()` and shows an
empty-state line if nothing survived. `HomePage` owns three filters above
it: a **domain filter** (Systems & Infrastructure / AI Engineering,
`role="group"` of `aria-pressed` buttons, **defaults to Systems**) that
scopes which sections render via `sectionDomain`; a format filter
(`All`/`Nuggets`/`Guides`); and tag chips (`All topics` + every tag in
`CONTENT`, so the chip set stays fixed regardless of domain or format).
All three compose; sections with no surviving items don't render.

**There is no pagination.** The earlier design paginated two flat
per-format lists at `PAGE_SIZE = 10` because each was 30-40 items long;
grouped into topic sections the largest is under a dozen, so the whole
catalog renders at once. `PaginatedContentList` and its `visibleCount`/"Load more"
machinery were deleted with this change — don't reintroduce them for the
home page. If a single section ever genuinely gets too long to scan, the
fix is to split the section (add a `Section` value), not to paginate
inside one.

Adding a third content format (see `CASE_STUDIES_PLAN.md`) means adding
`{ id: 'case-study', label: 'Case Studies' }` to `FORMAT_FILTERS` in
`HomePage.tsx`; `SectionedContentList` and `contentBySection()` are
already format-agnostic. A case study is still filed under a topic
`section` like everything else.

### Path alias

`@/` resolves to `src/` (configured in both `vite.config.ts` and
`tsconfig.app.json`).
