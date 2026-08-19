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
("nuggets") — patterns, gotchas, concepts — searchable and taggable, plus a
small set of longer-form "guides" (walkthroughs, best-practices
references) for topics that don't compress into a single idea. It is
**not** a note-taking app: there is no in-browser create/edit/delete flow.
Content is authored as source files and ships with the build, the same way
`ai-cauldron`'s lesson modules work. See [README.md](README.md) for the
user-facing feature list.

The only thing persisted in the browser is *reading state* — which item
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
- **Content is real, not fixtures**: since `NUGGETS`/`GUIDES` are static
  imports, tests exercise the actual shipped content (`Expand-Contract
  Pattern`, `Idempotency`) rather than seeding fake data into storage. If
  you rename or remove a nugget or guide referenced in a test
  (`HomePage.test.tsx`, `ContentPage.test.tsx`, `App.test.tsx`), update the
  test alongside it.
- Prefer `screen.getByRole()` over test IDs. Test user-visible behavior.

## Architecture

### Data model & content

One shape, deliberately minimal (`src/types.ts`):

```ts
interface Nugget {
  id: string;
  title: string;
  body: string;  // markdown — fenced ```lang blocks and ```mermaid diagrams render inline
  tags: string[];
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
    <slug>.md
    <slug>.ts                # metadata (format: 'guide'), same shape as a nugget's
    index.ts               # GUIDES: Nugget[]
  index.ts                 # CONTENT: Nugget[] = [...NUGGETS, ...GUIDES]
                            # getContent(id), contentPath(item) — everything
                            # that needs to look up or link to *either* format
                            # (search, sidebar, related, reading progress)
                            # reads through this file, not the per-format ones.
```

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
     tags: ['some', 'tags'],
     body,
     format: 'nugget',
   };
   ```
   Reuse existing tags where they genuinely fit (`reliability`, `patterns`,
   `apis`, `migrations`, `databases`, `performance`, `messaging`, `security`,
   `testing`, `git`, `ai`, `process`, `tooling`, `networking`) rather than
   inventing near-duplicates —
   the tag vocabulary is what drives both the home page's filter chips and the
   "Related" section (see below), so a fragmented vocabulary weakens both.
3. Import it and add it to the `NUGGETS` array in
   `src/content/nuggets/index.ts`.

**Adding a guide:** same three steps, but in `src/content/guides/`, with
`format: 'guide'`, added to the `GUIDES` array in
`src/content/guides/index.ts`. No other wiring is needed — the merged
`CONTENT` registry, routing, search, sidebar, and related-content lookup are
all format-aware already.

Body content is kept in a separate `.md` file (imported via Vite's `?raw`
suffix) rather than a JS template literal — a markdown body containing
fenced code blocks has literal backtick characters in it, which would
prematurely terminate a template literal string unless escaped. `?raw`
avoids that entirely.

### Related content

`getRelatedNuggets` (`src/lib/related.ts`) ranks every other item —
nuggets and guides both, it's format-agnostic — by number of shared tags
with the current one (ties broken alphabetically by title) and returns the
top 3. `ContentPage` renders those as a "Related" section below the
content, called with the merged `CONTENT` array so a nugget can surface a
related guide and vice versa. This is entirely tag-derived — there's no
per-item `related: [...]` field to maintain, so any new nugget or guide
participates automatically as long as its tags overlap with something
else's. If an item's related section looks wrong or empty, the fix is
almost always to its `tags`, not to `related.ts`.

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
`CONTENT`/`getContent()`/`contentPath()` from `src/content/index.ts` for
anything that spans both formats, or the per-format `NUGGETS`/`GUIDES`
constants directly when a view is deliberately scoped to just one (e.g.
the home page's tag-filtered nugget list).

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
(`React.lazy` + `Suspense`), used by `ContentPage`. Import
`LazyMarkdownRenderer`, not `MarkdownRenderer` directly, from any new call
site.

### Keyboard shortcuts

- `Ctrl`/`Cmd` + `K` — focus the header search bar

Wired in `useGlobalShortcuts` (`src/hooks/useGlobalShortcuts.ts`), called
from `AppShell` in `App.tsx`.

### Routing

Three routes (`src/App.tsx`), two of them pointing at the same page
component:

- `/` — `HomePage`: continue-reading banner, then a `role="tablist"` for
  "Nuggets" / "Guides" — each tab renders its own tag-filtered, paginated
  list (see "Pagination" below)
- `/nuggets/:id` and `/guides/:id` — both render `ContentPage`, which
  resolves the `:id` param through `getContent()` (the merged registry) and
  renders identically either way. There's no separate `GuidePage` — a guide
  is still just markdown; the only thing distinguishing routes is which URL
  segment reads naturally for a link. Use `contentPath(item)` (from
  `@/content`) rather than hand-building `/nuggets/${id}` or
  `/guides/${id}` — it picks the right prefix from `item.format` so call
  sites never need an `if` on format just to build a link.

`Header` (search, theme toggle) is rendered once in `AppShell`, above the
routed content, so it's present on every page.

### Sidebar

`Sidebar` (`src/components/Sidebar.tsx`) lists guides, then every nugget,
each group alphabetically by title — not grouped by tag. Tags are
multi-valued (an item can be both `reliability` and `patterns`), so a
tag-grouped sidebar would mean either duplicating entries across sections
or inventing an unspecified "primary tag." Topic-based browsing is
already the home page's job (tag chips + related content); the sidebar's
job is fast, unambiguous lookup by name from any page.

Each group is a `SidebarGroup` (a local component inside `Sidebar.tsx`,
not its own file — it isn't reused anywhere else yet) with its own
collapsed/expanded `useState`, defaulting to expanded. The heading is a
`<button aria-expanded>` wrapped in an `<h2>` (the WAI-ARIA accordion
pattern — a screen reader still gets heading navigation via the `h2`,
while the `button` carries the actual disclosure semantics), so
`getByRole('heading', ...)` and `getByRole('button', ...)` both resolve
to it in tests. The heading only renders — and is therefore only
collapsible — once there's more than one *non-empty* group; `Sidebar`
computes this by counting non-empty arrays
(`[SORTED_GUIDES, SORTED_NUGGETS].filter(...).length > 1`), not by
hardcoding the check around guides specifically, so a third group (see
`CASE_STUDIES_PLAN.md`) just needs adding to that same array — no
conditional logic to rewrite.

Topic links are indented further than their group heading (`pl-6` vs.
the heading's `px-3`) so they read as nested under it, not flush with
it — the link element itself still spans the full row width, so the
hover/active background isn't affected, only the text's start position.

Desktop and the mobile drawer are two separate `Sidebar` instances (see
below), so their collapsed states are independent — collapsing "Guides"
on desktop doesn't collapse it in the drawer.

`AppShell` renders two copies of it: a static one in a `hidden md:block`
`<aside>` for desktop, and a second one inside a fixed-overlay drawer
(`role="dialog"`) toggled by the hamburger button in `Header`, for
viewports below `md`. Both read the same `NUGGETS`/`GUIDES` constants —
there's no prop threading data into either. The drawer closes on backdrop
click, `Escape`, or clicking a link (`Sidebar`'s `onNavigate` prop).

The desktop `<aside>` is `sticky top-16` with its own `max-h-[calc(100vh-4rem)]`
and `overflow-y-auto`, plus `self-start` so it doesn't stretch to match
`<main>`'s height (which would leave nothing for `sticky` to stick
within). `top-16`/`4rem` matches `Header`'s rendered height — if `Header`'s
height ever changes, update both to match, or the sidebar will either gap
below the header or tuck under it. The effect: the sidebar stays pinned
in the viewport while the article scrolls, and only scrolls internally
once its own content (now 35+ nuggets and 15 guides) exceeds the viewport
height.

### Home page: tabs + pagination

`HomePage` shows one content type at a time behind a `role="tablist"` —
"Nuggets" and "Guides" — rather than stacking both as always-visible
sections. That stacking was the original design (see git history) but
stopped working once the catalog passed ~50 items combined; `CLAUDE.md`
had explicitly called out guides being unpaginated as a decision to
*reconsider* once there were "many guides" — there are now 15, so this
is that reconsideration.

Both tabs are the same `PaginatedContentList` component
(`src/components/PaginatedContentList.tsx`), given a different `items`
array (`NUGGETS` or `GUIDES`) and `label`. It owns its own tag-filter
chips and pagination (`PAGE_SIZE` = 10, a "Load N more" button appending
another page to `visibleCount`, reset to `PAGE_SIZE` whenever the tag
filter changes — otherwise a filter matching only a few items could
leave a stale, unreachable "Load more" state). Since every content array
is a plain in-memory list (no backend), "loading more" is just revealing
more of it — no fetch, no loading state to handle.

`HomePage` renders each tab's `PaginatedContentList` with `key="nuggets"`
/`key="guides"` — that's what resets filter/pagination state on tab
switch. Do **not** replace this with a `useEffect` inside
`PaginatedContentList` that syncs state to the `items` prop instead;
`key` is the React-recommended way to reset a component's state when
swapping what it's showing, and it avoids the extra render an effect-based
reset would cost.

Adding a third content format (see `CASE_STUDIES_PLAN.md`) means adding
a third entry to `TABS` in `HomePage.tsx` and a third
`PaginatedContentList` branch — the component itself needs no changes,
since it already takes `items`/`label` generically.

### Path alias

`@/` resolves to `src/` (configured in both `vite.config.ts` and
`tsconfig.app.json`).
