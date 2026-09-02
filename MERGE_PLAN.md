# Merge: ai-cauldron → develop-nuggets

Working branch: **`merge/ai-cauldron`**. Cut over to `main` when Phase 4 is green.
Source repo (READ-ONLY): `../ai-cauldron` (`C:/Users/steve/Desktop/ai-cauldron`).

This file is the shared contract for every agent on the merge. If a decision
here turns out wrong, change it here and note it — don't diverge silently.

## Locked decisions

- **Visualizations.** The 4 loop-structured RAG algorithms (`agentic`,
  `self-rag`, `corrective`, `graph`) become a lightweight step-through
  component (prev/next through captioned states highlighting a static
  SVG/Mermaid, code beside — **no `framer-motion`**, no play/pause, no SMIL
  motion). The other 6 (`standard`, `hybrid`, `hyde`, `multimodal`,
  `adaptive`, `rag-fusion`) become a Mermaid pipeline + full Python + a
  worked retrieval trace, embedded in their guide. `EmbeddingSpace` /
  `KnowledgeGraph` → static figures. `ReActTrace` → folds into the Agentic
  stepper.
- **Sequential learning** is a **curation layer** (`tracks`), not a new
  content `format`. A track is `{ id, title, summary, section, items:
  contentId[] }`. Guides stay guides. `Nugget` / `format` do not change.
- **No repo split.** One app, one Pages project, on this branch.

## Section mapping (9 modules → 9 sections, one per module)

Revised from the initial 7-section consolidation: 1C's inventory showed
`ai-reasoning` (15) and `ai-evaluation` (23) would blow past the
"under a dozen per section" guideline, and the Systems/AI sidebar
accordion already solves the length concern. One section per module.

| ai-cauldron module | `Section` value | `SECTION_LABELS` text | items |
|---|---|---|---|
| foundations | `ai-llm-internals` | LLM Internals | 10 |
| reasoning | `ai-reasoning` | Reasoning | 7 |
| adaptation | `ai-adaptation` | Model Adaptation | 8 |
| rag | `ai-retrieval` | Retrieval & RAG | 17 |
| agentic | `ai-agents` | Agents | 13 |
| orchestration | `ai-orchestration` | Orchestration | 10 |
| safety | `ai-safety` | Safety & Guardrails | 8 |
| evals | `ai-evaluation` | Evaluation | 10 |
| mlops | `ai-mlops` | MLOps & Infra | 13 |

Existing 10 systems sections are unchanged. `SECTION_ORDER`: all existing
systems sections first, then the 9 AI sections in the row order above.
Home page + sidebar gain a **domain split** (Systems / AI) above the
section list.

## Track mapping (1:1 with modules; order = lesson order in the module)

`foundations`→`llm-internals` · `reasoning`→`reasoning` ·
`adaptation`→`model-adaptation` · `rag`→`rag` · `agentic`→`agents` ·
`orchestration`→`orchestration` · `safety`→`safety-guardrails` ·
`evals`→`evaluation` · `mlops`→`mlops`

Each track's section is now its own (`reasoning`→`ai-reasoning`,
`model-adaptation`→`ai-adaptation`, `evaluation`→`ai-evaluation`,
`mlops`→`ai-mlops`) — section and track are 1:1.

## New `Tag` union values (add to `src/types.ts`, deliberately)

Proposed: `rag`, `agents`, `evals`, `prompting`, `inference`,
`fine-tuning`, `guardrails`, `mlops`, `embeddings`. Reuse existing `ai`,
`observability`-adjacent (`reliability`), `security` where they already
fit. Platform-Nav finalizes; Migration-Tooling's inventory flags gaps.

## Phase plan

- **P0 — Foundation** (Architect, on `merge/ai-cauldron` directly). DONE:
  heading anchors + `src/lib/slug.ts` (`slugify`, `dedupe`,
  `extractHeadings(markdown): {depth,text,id}[]`). Deps/tokens: no change
  until a viz component needs one. `jsdom` stays the test env.
- **P1 — Platform** (parallel worktrees):
  - **1A Platform-Nav** — `Section`/`Tag` unions, `SECTION_LABELS` /
    `_DESCRIPTIONS` / `_ORDER`, home-page domain split, sidebar
    super-grouping, update `src/content/index.test.ts`.
  - **1B/1D Platform-Tracks** — `src/content/tracks.ts` + `Track` type,
    `/tracks/:id` route + `TrackPage`, `lib/trackProgress.ts` (on
    `safeStorage`), `trackNeighbors()` in `src/content/index.ts` used by
    `ContentPage` pager when the item is in a track, "Resume" banner,
    TOC component in `ContentPage` (uses `extractHeadings`), `j`/`k` +
    `?` in `useGlobalShortcuts`. Tests.
  - **1C Migration-Tooling** — `scripts/migrate-cauldron.ts`, staging dir,
    `MIGRATION_INVENTORY.md`, link audit. (In progress.)
- **P2 — Content migration** (parallel, per module, after 1C): run
  converter, then per module: voice-edit, escaping fixes, write
  `summary`, assign `section`/`tags`, keep short lessons as nuggets,
  resolve `relatedAlgorithmId` → inline links, wire section `index.ts` +
  the module's `Track`. Rendered-diff QA.
- **P3 — Visualizations** (after 1A/1B): `StepThrough` component +
  `/interactive/:id` route; port 4 loop algos; static-ify 6; 2 figures.
- **P4 — Integration & cutover** (Architect): full green + bundle check,
  `README.md` + `CLAUDE.md` rewrite, cross-link pass, one Pages config +
  `basename`, redirect old ai-cauldron Pages, archive that repo.
  - **P4 correctness pass on migrated content:**
    - Normalize the model id in every code block: `claude-sonnet-4-6`
      → `claude-sonnet-5` across `src/content/guides/ai/**` (flagged by
      Migrator A; consistent across the whole staged corpus).
    - Restore the strict "no section left empty" assertion in
      `src/content/index.test.ts` (relaxed in P1A).
    - Wire the 9 `AI_*` section arrays into `GUIDES`
      (`src/content/guides/index.ts`) and fill each `Track.items` from the
      Content-Migrators' final ordered id lists.
    - `rm -rf migration-staging/` once all four sections' content is in
      `src/content/guides/ai/`.

## File ownership (avoid cross-agent conflicts)

| Files | Owner |
|---|---|
| `src/types.ts`, `src/lib/sections.ts`, `src/pages/HomePage.tsx`, `src/components/Sidebar.tsx`, `src/content/index.test.ts` | Platform-Nav |
| `src/content/tracks.ts`, `src/pages/TrackPage.tsx`, `src/lib/trackProgress.ts`, `src/hooks/useGlobalShortcuts.ts`, `src/hooks/useContinueReading.ts`, `src/components/TableOfContents.tsx` | Platform-Tracks |
| `src/content/index.ts`, `src/pages/ContentPage.tsx` | Platform-Tracks (Architect merges) |
| `scripts/`, `migration-staging/`, `MIGRATION_INVENTORY.md` | Migration-Tooling |
| `src/content/nuggets/**`, `src/content/guides/**`, per-section `index.ts` | Content-Migrator (per module) |
| `src/components/rag/**` → `src/components/interactive/**`, `/interactive` route | Viz-Engineer |
| `MERGE_PLAN.md`, `CLAUDE.md`, `README.md`, `src/App.tsx` routing | Architect |

## Commit trailer (every commit, every agent)

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_016NZjULUAg58JupDez6zFcp
```
