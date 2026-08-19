# Case Studies: implementation plan

A design doc, not a commitment — this is here so that *if* case studies
get greenlit, the work starts from a decided plan instead of a blank
page. Nothing here is implemented. It assumes the codebase as of the
`format`-badge work (nuggets + guides, `FORMAT_LABELS` in
`src/lib/format.ts`, `contentPath()` in `src/content/index.ts`) and is
written to stay consistent with that architecture, not introduce a
parallel one.

## 1. What a case study actually is

A full worked answer to a named interview prompt — "Design Bitly,"
"Design Uber" — walking through requirements, a high-level design, and
deep dives into the 2-3 trickiest parts, in *combination*. This is a
different shape of content than anything in the catalog today:

| | Nugget | Guide | Case study |
| --- | --- | --- | --- |
| Scope | One concept | One topic, several angles | One system, many concepts applied together |
| Length | 300-700 words | 900-2,000 words | Likely 2,500-4,000+ words |
| Purpose | Recall | Reference | Applied synthesis |
| Depends on other content? | Rarely | Sometimes (cross-links) | Heavily — a case study is *mostly* stitching together concepts that already have a nugget or guide |

That last row is the important one: a case study should **not**
re-explain rate limiting, sharding, or the outbox pattern from scratch —
it should apply them to this specific system and link out to the
nugget/guide that already covers the mechanism, exactly the way
`APIs: Best Practices` already links into `Rate Limiting` and
`SQL Injection & Parameterized Queries` rather than duplicating them.
This is the single most important authoring rule for this format —
see §8.

## 2. Content model: extend `format`, don't fork the type

**Decision: reuse the existing `Nugget` interface, add `'case-study'` to
the `format` union.** Do not create a parallel `CaseStudy` type with
different fields.

```ts
// src/types.ts
export interface Nugget {
  id: string;
  title: string;
  body: string;
  tags: string[];
  format: 'nugget' | 'guide' | 'case-study';
}
```

Why not a richer type with structured fields (difficulty, companies
known to ask it, estimated time)? Because this codebase has already
made this call once — `CLAUDE.md` explicitly rejects adding a `date`
field to `Nugget` for exactly this reason ("they'd just be a
maintenance cost with no real payoff... reconsider then — don't re-add
'just in case'"). The same reasoning applies here: everything a case
study needs to *say* (requirements, difficulty context, tradeoffs) can
be markdown prose under a conventional `##` heading, the same way
nuggets already convey structure through headings (`## What it is`,
`## Key insight`) without a single typed field for any of it. Add a
typed field later only if a real, concrete UI need shows up (e.g., a
difficulty filter chip) — not preemptively.

**Naming convention:** the third `format` value is `'case-study'`
(kebab-case, matching `'nugget'`/`'guide'`), not `'caseStudy'` or
`'case_study'`.

## 3. Directory & registry — mirror `guides/` exactly

```
src/content/
  case-studies/
    bitly.md
    bitly.ts
    index.ts        # CASE_STUDIES: Nugget[]
```

`src/content/case-studies/index.ts`:

```ts
import type { Nugget } from '@/types';

/** Add a new case study's import here — see CLAUDE.md "Adding a case study". */
export const CASE_STUDIES: Nugget[] = [];
```

`src/content/index.ts` gets a third spread:

```ts
import { CASE_STUDIES } from './case-studies';

export const CONTENT: Nugget[] = [...NUGGETS, ...GUIDES, ...CASE_STUDIES];
```

Nothing else in `content/index.ts` changes conceptually — `getContent`
already searches `CONTENT` generically. `search.ts` and `related.ts`
need zero changes either; both already operate on whatever `Nugget[]`
they're handed, which is exactly why nuggets and guides needed no
changes to either file. This is the payoff of the format-as-a-field
design from the nugget/guide split — it keeps paying off for a third
format for free.

## 4. `contentPath()` must stop being a ternary

Today:

```ts
// src/content/index.ts — current
export function contentPath(item: Nugget): string {
  return `/${item.format === 'guide' ? 'guides' : 'nuggets'}/${item.id}`;
}
```

A third format breaks this silently — anything with
`format: 'case-study'` would currently resolve to `/nuggets/:id`,
which is wrong and won't error at compile time (a ternary doesn't
enforce exhaustiveness). Replace it with a `Record`, following the
exact pattern `FORMAT_LABELS` (`src/lib/format.ts`) already
established for display labels:

```ts
// src/lib/format.ts
export const FORMAT_ROUTE_SEGMENTS: Record<Nugget['format'], string> = {
  nugget: 'nuggets',
  guide: 'guides',
  'case-study': 'case-studies',
};

export const FORMAT_LABELS: Record<Nugget['format'], string> = {
  nugget: 'Nugget',
  guide: 'Guide',
  'case-study': 'Case Study',
};
```

```ts
// src/content/index.ts
import { FORMAT_ROUTE_SEGMENTS } from '@/lib/format';

export function contentPath(item: Nugget): string {
  return `/${FORMAT_ROUTE_SEGMENTS[item.format]}/${item.id}`;
}
```

Once this change lands, TypeScript will refuse to compile until
`FORMAT_LABELS` also has a `'case-study'` entry — the exhaustiveness
check catches both at once. This is exactly the scenario the
`format`-badge session's refactor (moving the guide badge from an `if`
to a `Record`) was explicitly done in anticipation of.

## 5. Routing

`src/App.tsx` gets one more route, reusing `ContentPage` — no new page
component:

```tsx
<Route path="/case-studies/:id" element={<ContentPage />} />
```

`ContentPage` (`src/pages/ContentPage.tsx`) needs **no changes** to
render a case study — it already resolves via `getContent(id)` and
renders `item.body` through `LazyMarkdownRenderer` regardless of
format. The "Related" footer (tag-derived, via `getRelatedNuggets`)
also works unchanged and is arguably *more* valuable here than
anywhere else in the catalog — a case study tagged with the same tags
as the nuggets/guides it draws on will automatically surface exactly
those as "Related," which is the discovery path from "I just read the
Bitly case study" back to "let me re-read the Sharding Strategies
nugget it referenced."

**Open question — table of contents.** Case studies will be by far the
longest content in the catalog (§1). `CLAUDE.md`'s existing guidance
was explicit about *not* building a TOC/scrollspy for guides
speculatively ("premature... build one when guide content actually
needs it"). Case studies are the point where that need becomes real —
recommend building a simple heading-based TOC (extract `##`/`###`
headings from the rendered markdown, sticky alongside the article,
similar in spirit to the sidebar's own sticky treatment) **once there
are 2-3 real case studies to test it against**, not before. Don't
build this speculatively in the same PR that adds the format.

## 6. UI surfaces that need a third group

Every place that currently branches on "guide vs. nugget" needs a third
branch. Concretely:

- **`src/components/Sidebar.tsx`** — currently two groups
  (`SORTED_GUIDES`, `SORTED_NUGGETS`), each rendered only when
  `GUIDES.length > 0`. Add `SORTED_CASE_STUDIES` the same way. The
  existing "only show a group heading once there's more than one
  group" logic needs to become "show a heading once there's more than
  one *non-empty* group," not just "once guides exist" — check this
  carefully, since the current condition (`SORTED_GUIDES.length > 0`)
  hardcodes guides as the group that triggers headings; with three
  possible groups it should probably be based on how many of the three
  arrays are non-empty, not specifically on guides.
- **`src/pages/HomePage.tsx`** — currently a "Guides" section (small,
  unpaginated, always fully visible) above the paginated "Nuggets"
  section. **Decide before building:** will case studies stay a small,
  curated set (→ unpaginated, like guides) or grow toward Hello
  Interview's ~30 (→ paginated, like nuggets)? Recommend paginated —
  a "Case Studies" section behaves and reads much more like the
  nugget list (a growing catalog you browse) than the guide list (a
  small, always-visible reference set). If paginated, it needs its own
  `visibleCount`/`PAGE_SIZE` state, structurally identical to the
  existing nugget pagination — don't try to share state between two
  independently-paginated sections.
- **`src/components/SearchBar.tsx`** — no changes needed beyond what
  landed in this session; it already renders `FORMAT_LABELS[item.format]`
  generically over whatever's in `CONTENT`.
- **`src/components/ContentListItem.tsx`** — no changes needed; it
  already renders generically via `contentPath(item)`.

## 7. Tags — no new tag for the format itself

Same rule as guides: don't add a `case-study` tag. `format` already
carries that distinction; a tag would conflate content-shape with
topic, which is exactly what `format` was introduced to avoid. Tag
each case study with the real topics it touches (`apis`, `databases`,
`reliability`, …) so the existing tag-driven mechanisms (home page
filter chips, Related section) work on it the same as everything else.
Home page tag chips currently filter only the nugget list
(`NUGGETS`, not `CONTENT`) — decide whether case studies should
participate in that filter once they're paginated like nuggets (§6);
if so, the chip computation and `filtered` logic in `HomePage.tsx`
needs to run over nuggets **and** case studies, not `NUGGETS` alone.

## 8. Content authoring rule: link, don't re-teach

The biggest risk with this format is content rot via duplication — a
case study that re-explains rate limiting *inline* instead of linking
to the `Rate Limiting` nugget will drift out of sync the next time that
nugget is deepened (as it was, twice, this session). Every case study
should:

1. State the requirement/constraint in its own words (1-2 sentences).
2. Name the pattern/technology being applied.
3. Link to the nugget or guide that actually teaches it —
   `[rate limiting](/nuggets/rate-limiting)`, `[Redis](/guides/redis)`.
4. Spend its own word budget on what's specific to *this* system: which
   tradeoff was chosen and why, given this system's actual constraints.

A case study is allowed to introduce a genuinely new concept that has
no existing nugget/guide — when that happens, the right move is
usually to add that concept as its own nugget or guide *first* (so it
gets the same discoverability and cross-linking as everything else),
then reference it from the case study, rather than explaining it
inline and orphaning it there.

## 9. Scope warning

Each case study is a bigger content investment than anything shipped so
far — likely 3-5x a guide's length once it includes a high-level design
diagram and 2-3 real deep dives. Hello Interview's own catalog runs
~30 of these. Recommend a **pilot of 2-3** (a simple one like Bitly, a
medium one with a clear "interesting deep dive" like a Rate Limiter,
and one that stresses the cross-linking rule in §8 hardest — something
that touches many existing nuggets/guides, like a URL shortener with
analytics) before committing to a larger catalog or building the TOC
feature from §5.

## 10. Documentation updates needed

- **`CLAUDE.md`**
  - "Data model & content": extend the `format` union documentation
    (§2), document `src/content/case-studies/`, add an "Adding a case
    study" step-list mirroring "Adding a nugget"/"Adding a guide."
  - New subsection under Architecture: "Case studies" — the
    link-don't-re-teach rule (§8) belongs here, in the same spirit as
    the existing "Adding a nugget" tag-reuse guidance.
  - "Routing": add the third route and note `ContentPage` needs no
    changes.
  - "Sidebar": document the third group and the corrected
    non-empty-group-count condition (§6).
  - "Pagination": document whichever decision is made in §6 for case
    studies (paginated vs. always-visible), and why.
- **`README.md`** — add case studies to the intro paragraph and feature
  list, same treatment guides got when they were introduced.

## 11. Test updates needed

- **`src/components/Sidebar.test.tsx`** — currently asserts two groups
  by querying `heading, { name: 'Guides' }` and `heading, { name: 'Nuggets' }`
  and their sibling links. Add a third case for `'Case Studies'`, and
  re-verify the "headings only render with >1 non-empty group" logic
  from §6 with a case that has, say, guides + case studies but zero
  nuggets (unlikely in practice, but the *logic* should be correct for
  it, not just for the two groups that happen to be non-empty today).
- **`src/pages/HomePage.test.tsx`** — if case studies are paginated
  (§6 recommendation), this needs the same shape of tests the nugget
  list already has (caps at `PAGE_SIZE`, "Load more" appends another
  page, resets on tag-filter change) applied to the case-study section
  too — likely by generalizing the existing `nuggetListItems()` helper
  pattern rather than copy-pasting a parallel set of tests.
- **`src/lib/format.test.ts`** — add the `'case-study'` entries to both
  `FORMAT_LABELS` and `FORMAT_ROUTE_SEGMENTS` assertions.
- **`src/content/index.test.ts`** — `CONTENT` merge test
  (`toHaveLength(NUGGETS.length + GUIDES.length)`) needs the third
  addend; add a `getContent`/`contentPath` case for a case-study id.
- **`src/components/SearchBar.test.tsx`** — the existing format-badge
  test only needs a third case-study fixture if one becomes convenient
  to search for in the real catalog (e.g. once a `bitly` case study
  exists, assert its result shows a `Case Study` badge) — not required
  to land the format itself, since the existing test already proves the
  mechanism is format-generic (it reads `FORMAT_LABELS[item.format]`,
  not a hardcoded list of formats).
- **New `ContentPage.test.tsx` case** — render at `/case-studies/:id`
  for a real (or fixture) case study id, same shape as the existing
  nugget/guide-format assertions.
- **If the TOC feature (§5) is built**, it needs its own test coverage
  for heading extraction and jump-link behavior — scope that as part of
  whatever PR actually adds the TOC, not this one.

## 12. Open decisions this doc deliberately leaves open

1. Paginate case studies like nuggets, or keep them always-visible like
   guides? (§6 — recommendation given, not decided.)
2. Build the TOC now or after 2-3 real case studies exist? (§5 —
   recommendation: after.)
3. Should home page tag chips filter case studies too, once they exist
   in volume? (§7.)
4. Pilot scope: which 2-3 systems to write first? (§9.)

None of these block starting on §2-§4 (type/registry/routing
plumbing) — they only need answers before §6 (UI) and content
authoring begin in earnest.
