# Design principles

This app is a large read-only reference (150+ items across two domains,
nine tracks, ten interactive pages). At that size, **navigation is the
product** — the risk is not "too little content" but "can't find it / too
much on screen at once." This document is the rubric for UI changes.

The heuristics below are the [Laws of UX](https://lawsofux.com) (Jon
Yablonski). Each row is the law, a one-line definition, and **how it
applies here**. Below the table are per-surface checklists — when you
change a surface, re-read its row.

> Keep `CLAUDE.md`'s `### Design principles` block (a short extract of
> this) in sync when the everyday-gating set changes.

## The laws, applied

### Reducing cognitive load

| Law | In one line | How it applies here |
|---|---|---|
| **Hick's Law** | Decision time grows with the number and complexity of choices. | Never render the full tag vocabulary (~22) as flat chips. Filters collapse into one popover/menu; choices are revealed on request, not on load. |
| **Miller's Law** | People hold ~7±2 chunks in working memory. | The sidebar shows one domain (~10 sections) at a time, not 19. "Related" is capped at 3. Track syllabi are ~7–17 — near the edge; longer would need sub-grouping. |
| **Chunking** | Group related content into labelled units. | Section charters, track grouping, one bounded filter toolbar rather than three loose rows. |
| **Cognitive Load** | Total mental effort to use the interface; minimise the *extraneous* kind. | The through-line of every change below. If a control isn't needed on first view, defer it. |
| **Tesler's Law** | Some complexity is irreducible — decide who carries it. | The casual reader gets a clean default; the power user gets a compact/dense mode and keyboard nav. Don't average the two into a mediocre middle. |
| **Occam's Razor** | Remove elements until the design breaks, then add the last one back. | The three stacked filter rows collapse to one toolbar. Every nav element earns its place. |

### Perception & layout (Gestalt)

| Law | In one line | How it applies here |
|---|---|---|
| **Law of Similarity** | Elements that look alike are perceived as related. | The three nav tiers (domain / section / item) must look *distinct*. Controls that do the same kind of job must look *the same*. Today's near-identical domain/section headers and three filter-button styles both violate this. |
| **Law of Proximity** | Close elements are perceived as a group. | Spacing carries the grouping in the sidebar (whitespace between sections, not borders) and the toolbar (related controls tight, unrelated ones apart). |
| **Law of Common Region** | A shared bounded area groups its contents. | The filter toolbar is one bounded region; cards have a region; a track's items sit in one panel. |
| **Law of Uniform Connectedness** | Visually connected elements are the most strongly grouped of all. | The sidebar's nested item list gets a `border-l` connector line tying items to their section heading. |
| **Law of Prägnanz** | The eye resolves complex shapes into the simplest available form. | Prefer plain lists, few rules, generous whitespace over boxes-within-boxes. |
| **Von Restorff Effect** | The item that differs is the one remembered. | Exactly one emphasised element per view — the "Continue reading" card, the primary CTA, the active nav row. If everything is highlighted, nothing is. |
| **Selective Attention** | People filter out anything that looks like an ad or chrome. | Keep real affordances (search, filters) looking like content controls, not banners. Don't stack decorative callouts near the top. |

### Behaviour over time

| Law | In one line | How it applies here |
|---|---|---|
| **Serial Position Effect** | First and last items in a list are best remembered. | Order sections and nav so the highest-value ones sit at the ends. "Continue reading" is first on the home page; keyboard-shortcut help is reachable at the end of the sidebar. |
| **Zeigarnik Effect** | Unfinished tasks stay in mind. | Surface incomplete tracks — progress bars, "3 / 10", a resume affordance on the home page. The `trackProgress` mechanism already exists; use it visibly. |
| **Goal-Gradient Effect** | Motivation rises as the goal nears. | Show a track's remaining count ("2 lessons left"), and a nearly-full progress bar prominently. |
| **Peak-End Rule** | An experience is judged by its most intense point and its end. | The end of a guide should feel like an arrival: a satisfying prev/next pager, "mark complete", "Related", and — inside a track — a visible step toward completion. |
| **Parkinson's Law** | Work expands to fill the time available. | Fast paths (instant search, `j`/`k`, ⌘K) keep a lookup from sprawling into a browse session. |
| **Doherty Threshold** | Engagement holds when the system responds in <400 ms. | Keep the lazy-load boundaries (`LazyMarkdownRenderer`, `/interactive`), show skeletons, and keep search results instant. Never block first paint on Shiki/Mermaid. |

### Expectation & robustness

| Law | In one line | How it applies here |
|---|---|---|
| **Jakob's Law** | Users expect this site to work like the other sites they know. | Behave like Stripe / GitHub / Linear docs: a visible search box, a left tree that behaves conventionally, ⌘K, breadcrumbs, an on-page TOC. Don't invent novel nav. |
| **Fitts's Law** | Time to hit a target scales with distance and inversely with size. | Sidebar rows are full-width click targets; toolbar controls are comfortably sized; the primary CTA is large and near where the eye lands. |
| **Postel's Law** | Be liberal in what you accept, conservative in what you emit. | Search tolerates case, typos, and partial matches (Fuse.js fuzzy). Internal links accept `/nuggets/`, `/guides/`, `/tracks/`, `/interactive/` and are validated in tests. |
| **Aesthetic-Usability Effect** | A polished interface is perceived as more usable and is forgiven more. | The visual pass is not decoration — consistent spacing, type scale, and colour tokens measurably raise perceived usability. |

### Scoping effort

| Law | In one line | How it applies here |
|---|---|---|
| **Pareto Principle** | ~80% of use comes from ~20% of the content. | A hand-curated "Start here" set (`src/content/curated.ts`) surfaces the high-value minority instead of relying on the reader to find it. |

## Per-surface checklists

**Sidebar** (`src/components/Sidebar.tsx`)
Similarity (three tiers must look different) · Uniform Connectedness (connector line) · Miller (one domain visible) · Proximity (whitespace groups) · Fitts (full-row targets) · Serial Position (key sections at the ends) · Jakob (conventional docs tree).

**Home / hub** (`src/pages/HubPage.tsx`)
Hick + Occam (no filter wall on landing) · Von Restorff (one emphasised card) · Serial Position (Resume first) · Zeigarnik + Goal-Gradient (track progress) · Jakob (visible search) · Pareto (curated set) · Chunking (domain cards, tracks row).

**Browse** (`src/pages/BrowsePage.tsx`)
Hick (tags behind one popover) · Common Region (one toolbar) · Tesler (compact mode) · Doherty (instant filtering) · Proximity (active-filter chips only when set) · Miller (jump-to-section nav in the toolbar's second row when >1 section shows).

**Content page** (`src/pages/ContentPage.tsx`)
Peak-End (a rewarding end block) · Zeigarnik / Goal-Gradient (track progress + mark-complete) · Doherty (lazy render, skeleton) · Serial Position (TOC, prev/next) · Fitts (large pager targets).

**Interactive** (`src/pages/InteractivePage.tsx`, `src/components/interactive/`)
Doherty (lazy, no blocking) · Prägnanz (static, legible diagrams) · Von Restorff (the active step stands out) · Jakob (familiar prev/next/step controls).

## Using this doc

- Before a UI change, read the relevant surface checklist and the rows it names.
- If a change trades against a law, say which and why in the PR/commit.
- New law-relevant decisions get a row or a checklist line here — this file is the source of truth; `CLAUDE.md` carries only the short extract.
