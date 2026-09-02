/**
 * migrate-cauldron.ts
 *
 * One-shot migration helper: pulls the 9 learning modules out of the sibling
 * `ai-cauldron` repo and stages each lesson as a `.md` + `.ts` pair in the
 * shape this repo's guides use (see `src/content/guides/*`).
 *
 * Run:  npx tsx scripts/migrate-cauldron.ts
 *
 * Output (all under the repo root — a staging area, not wired into `CONTENT`):
 *   migration-staging/<section>/<slug>.md    lesson body, ready for `?raw` import
 *   migration-staging/<section>/<slug>.ts    Nugget metadata (summary left as TODO)
 *   migration-staging/<section>/index.ts     imports + arrays that section's items
 *   migration-staging/README.md              what this is, caveats, how to re-run
 *   MIGRATION_INVENTORY.md                   full per-lesson inventory + content notes
 *
 * Notes:
 *  - ai-cauldron's module files store each lesson body as a JS template literal
 *    (`` \` ``, `\${`, `\\` are escaped). We `import()` the module rather than
 *    text-parse it, so the JS engine evaluates the template literal — which
 *    performs exactly that un-escaping — and `lesson.content` is already raw
 *    markdown by the time we see it. Nothing else about the body is touched.
 *  - The target `section` values (`ai-llm-internals`, `ai-reasoning`, …) are not
 *    yet in the `Section` union in `src/types.ts`. That union is owned by another
 *    agent; the staged `.ts` files intentionally reference the future values.
 *  - Idempotent: the staging directory is wiped and rebuilt on every run.
 */

import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, '..');

// ---------------------------------------------------------------------------
// Config: module -> section / track, and per-module tag guesses.
// ---------------------------------------------------------------------------

/** ai-cauldron module id -> develop-nuggets `section` value. One section per module (9). */
const MODULE_SECTION: Record<string, string> = {
  foundations: 'ai-llm-internals',
  reasoning: 'ai-reasoning',
  adaptation: 'ai-adaptation',
  rag: 'ai-retrieval',
  agentic: 'ai-agents',
  orchestration: 'ai-orchestration',
  safety: 'ai-safety',
  evals: 'ai-evaluation',
  mlops: 'ai-mlops',
};

/** ai-cauldron module id -> track id (inventory only; the tracks feature is not built here). */
const MODULE_TRACK: Record<string, string> = {
  foundations: 'llm-internals',
  reasoning: 'reasoning',
  adaptation: 'model-adaptation',
  rag: 'rag',
  agentic: 'agents',
  orchestration: 'orchestration',
  safety: 'safety-guardrails',
  evals: 'evaluation',
  mlops: 'mlops',
};

/** Module order = the order ai-cauldron's own MODULES array uses. */
const MODULE_ORDER = [
  'foundations',
  'reasoning',
  'adaptation',
  'rag',
  'agentic',
  'orchestration',
  'safety',
  'evals',
  'mlops',
];

/** Valid tag vocabulary — mirror of the `Tag` union in `src/types.ts`. */
const TAG_UNION = [
  'ai',
  'apis',
  'auth',
  'databases',
  'git',
  'messaging',
  'migrations',
  'networking',
  'patterns',
  'performance',
  'process',
  'reliability',
  'security',
  'testing',
  'tooling',
  'web',
] as const;
type Tag = (typeof TAG_UNION)[number];

/** Base tags applied to every lesson in a module. `ai` is always present. */
const MODULE_BASE_TAGS: Record<string, Tag[]> = {
  foundations: ['ai', 'performance'],
  reasoning: ['ai', 'patterns'],
  adaptation: ['ai', 'patterns'],
  rag: ['ai', 'patterns'],
  agentic: ['ai', 'patterns'],
  orchestration: ['ai', 'patterns', 'reliability'],
  safety: ['ai', 'security'],
  evals: ['ai', 'testing'],
  mlops: ['ai', 'process', 'reliability'],
};

/** Keyword -> extra tag, applied when a lesson's title or body matches. */
const KEYWORD_TAGS: { pattern: RegExp; tag: Tag }[] = [
  {
    pattern: /\b(eval|evals|benchmark|metric|regression test|unit test)\b/i,
    tag: 'testing',
  },
  {
    pattern:
      /\b(inject|prompt injection|jailbreak|pii|privacy|red[- ]team|moderation|guardrail|governance|adversarial)\b/i,
    tag: 'security',
  },
  {
    pattern:
      /\b(latency|throughput|quantiz|kv cache|speculative|cost optimiz|scale|scaling)\b/i,
    tag: 'performance',
  },
  {
    pattern:
      /\b(ci\/cd|pipeline|deploy|deployment|rollout|canary|monitor|observab|lifecycle|version control)\b/i,
    tag: 'process',
  },
  {
    pattern:
      /\b(vector database|vector db|embedding|chunk|chunking|index|colbert)\b/i,
    tag: 'databases',
  },
  {
    pattern: /\b(streaming|websocket|real[- ]time|protocol|transport)\b/i,
    tag: 'networking',
  },
  {
    pattern:
      /\b(framework|library|sdk|tooling|langchain|langgraph|llamaindex)\b/i,
    tag: 'tooling',
  },
];

// ---------------------------------------------------------------------------
// Locate the ai-cauldron checkout.
// ---------------------------------------------------------------------------

function findCauldronModulesDir(): string {
  const candidates = [
    process.env.AI_CAULDRON_PATH,
    resolve(REPO_ROOT, '../ai-cauldron'),
    resolve(REPO_ROOT, '../../ai-cauldron'),
    resolve(REPO_ROOT, '../../../ai-cauldron'),
    resolve(REPO_ROOT, '../../../../ai-cauldron'),
    'C:/Users/steve/Desktop/ai-cauldron',
  ].filter((p): p is string => Boolean(p));

  for (const base of candidates) {
    const modulesIndex = resolve(base, 'src/modules/index.ts');
    if (existsSync(modulesIndex)) return resolve(base, 'src/modules');
  }
  throw new Error(
    'Could not find ai-cauldron. Set AI_CAULDRON_PATH to its repo root, e.g.\n' +
      '  AI_CAULDRON_PATH=/path/to/ai-cauldron npx tsx scripts/migrate-cauldron.ts',
  );
}

// ---------------------------------------------------------------------------
// Types mirrored from ai-cauldron (kept local — no dependency on its tsconfig).
// ---------------------------------------------------------------------------

interface Lesson {
  id: string;
  title: string;
  readTime: string;
  content: string;
  relatedAlgorithmId?: string;
}
interface CauldronModule {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

interface StagedLesson {
  moduleId: string;
  section: string;
  track: string;
  trackOrder: number;
  lesson: Lesson;
  slug: string; // final slug after collision resolution
  bareSlug: string; // the raw lesson id
  wordCount: number;
  tags: Tag[];
  fenceLangs: Record<string, number>;
  bareFences: number;
  htmlTags: string[];
  tableCount: number;
  internalLinks: string[];
  brokenFlags: string[];
}

// ---------------------------------------------------------------------------
// Small helpers.
// ---------------------------------------------------------------------------

const camel = (slug: string): string =>
  slug.replace(/[^a-zA-Z0-9]+([a-zA-Z0-9])/g, (_, c: string) =>
    c.toUpperCase(),
  );

const sq = (s: string): string => s.replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const wordCount = (s: string): number => {
  const trimmed = s.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
};

function analyseBody(content: string) {
  const lines = content.split('\n');

  const fenceLangs: Record<string, number> = {};
  let bareFences = 0;
  let fenceOpen = false;
  for (const line of lines) {
    const m = line.match(/^\s*```([^\s`]*)\s*$/);
    if (!m) continue;
    if (!fenceOpen) {
      const lang = m[1].trim();
      if (lang) fenceLangs[lang] = (fenceLangs[lang] ?? 0) + 1;
      else bareFences += 1;
      fenceOpen = true;
    } else {
      fenceOpen = false;
    }
  }

  // GitHub-flavoured tables: count header-separator rows (|---|---|).
  const tableCount = lines.filter((l) =>
    /^\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(l),
  ).length;

  // Raw HTML element tags in the body (excludes autolinks / protocol-y things).
  const htmlSet = new Set<string>();
  const htmlRe = /<(\/?)([a-zA-Z][a-zA-Z0-9]*)(\s[^>]*)?\/?>/g;
  let hm: RegExpExecArray | null;
  while ((hm = htmlRe.exec(content))) {
    const tag = hm[2].toLowerCase();
    if (
      [
        'br',
        'div',
        'table',
        'tr',
        'td',
        'th',
        'thead',
        'tbody',
        'img',
        'sub',
        'sup',
        'details',
        'summary',
        'span',
        'kbd',
        'hr',
        'u',
        'b',
        'i',
        'small',
        'code',
        'pre',
        'a',
        'p',
        'ul',
        'ol',
        'li',
        'strong',
        'em',
        'blockquote',
        'figure',
        'figcaption',
        'section',
        'nav',
        'mark',
      ].includes(tag)
    ) {
      htmlSet.add(tag);
    }
  }

  // Internal markdown links: ](/...) and ](#...).
  const internalLinks: string[] = [];
  const linkRe = /\]\((\/[^)\s]*|#[^)\s]*)\)/g;
  let lm: RegExpExecArray | null;
  while ((lm = linkRe.exec(content))) internalLinks.push(lm[1]);

  // "Looks broken" heuristics.
  const brokenFlags: string[] = [];
  const fenceTotal = lines.filter((l) => /^\s*```/.test(l)).length;
  if (fenceTotal % 2 !== 0) brokenFlags.push('odd number of code fences');
  if (content.includes('\\${')) brokenFlags.push('leftover \\${ escape');
  if (/\\`/.test(content)) brokenFlags.push('leftover \\` escape');
  if (content.trim().length < 200)
    brokenFlags.push('very short body (<200 chars)');
  // Judge the final line. Strip trailing emphasis/code markers; a trailing `|`
  // is a Markdown table row (a valid way for a body to end), so allow it.
  const tail = content.trim().replace(/[*_`~\s]+$/, '');
  const lastChar = tail.slice(-1);
  if (lastChar && !/[.!?):"'\]\d}|A-Za-z]/.test(lastChar)) {
    brokenFlags.push(`ends on unexpected character "${lastChar}"`);
  }
  if (/\b(TODO|FIXME|XXX|WIP|PLACEHOLDER)\b/.test(content)) {
    brokenFlags.push('contains TODO/FIXME/placeholder marker');
  }

  return {
    fenceLangs,
    bareFences,
    tableCount,
    htmlTags: [...htmlSet].sort(),
    internalLinks,
    brokenFlags,
  };
}

function guessTags(moduleId: string, lesson: Lesson): Tag[] {
  const base = MODULE_BASE_TAGS[moduleId] ?? ['ai'];
  const found = new Set<Tag>(base);
  const hay = `${lesson.title}\n${lesson.content}`;
  for (const { pattern, tag } of KEYWORD_TAGS) {
    if (pattern.test(hay)) found.add(tag);
  }
  // Deterministic order: `ai` first, then TAG_UNION order.
  const ordered = TAG_UNION.filter((t) => found.has(t));
  return ordered.slice(0, 4);
}

// ---------------------------------------------------------------------------
// Load modules.
// ---------------------------------------------------------------------------

async function loadModules(modulesDir: string): Promise<CauldronModule[]> {
  const out: CauldronModule[] = [];
  for (const id of MODULE_ORDER) {
    const file = resolve(modulesDir, `${id}.ts`);
    if (!existsSync(file)) throw new Error(`Missing module file: ${file}`);
    const ns = (await import(pathToFileURL(file).href)) as Record<
      string,
      unknown
    >;
    const mod = Object.values(ns).find(
      (v): v is CauldronModule =>
        typeof v === 'object' &&
        v !== null &&
        Array.isArray((v as CauldronModule).lessons),
    );
    if (!mod) throw new Error(`No Module export found in ${file}`);
    if (mod.id !== id) {
      console.warn(
        `  ! ${id}.ts exports module id "${mod.id}" (expected "${id}") — using file name.`,
      );
    }
    out.push({ ...mod, id });
  }
  return out;
}

// ---------------------------------------------------------------------------
// Build the staged-lesson list, resolving slug collisions.
// ---------------------------------------------------------------------------

interface Collision {
  bareSlug: string;
  entries: { moduleId: string; section: string; resolvedSlug: string }[];
}

function stageLessons(modules: CauldronModule[]): {
  staged: StagedLesson[];
  collisions: Collision[];
} {
  // First pass: group by bare slug (lesson id) to detect cross-module collisions.
  const byBareSlug = new Map<string, { moduleId: string; lesson: Lesson }[]>();
  for (const mod of modules) {
    for (const lesson of mod.lessons) {
      const arr = byBareSlug.get(lesson.id) ?? [];
      arr.push({ moduleId: mod.id, lesson });
      byBareSlug.set(lesson.id, arr);
    }
  }

  const collisions: Collision[] = [];
  const finalSlugs = new Set<string>();
  const staged: StagedLesson[] = [];

  for (const mod of modules) {
    const section = MODULE_SECTION[mod.id];
    const track = MODULE_TRACK[mod.id];
    mod.lessons.forEach((lesson, i) => {
      const clash = (byBareSlug.get(lesson.id) ?? []).length > 1;
      let slug = clash ? `${mod.id}-${lesson.id}` : lesson.id;
      // Paranoia: if even the prefixed slug clashes, disambiguate with an index.
      let n = 2;
      while (finalSlugs.has(slug)) slug = `${mod.id}-${lesson.id}-${n++}`;
      finalSlugs.add(slug);

      const analysis = analyseBody(lesson.content);
      staged.push({
        moduleId: mod.id,
        section,
        track,
        trackOrder: i + 1,
        lesson,
        slug,
        bareSlug: lesson.id,
        wordCount: wordCount(lesson.content),
        tags: guessTags(mod.id, lesson),
        ...analysis,
      });
    });
  }

  for (const [bareSlug, entries] of byBareSlug) {
    if (entries.length <= 1) continue;
    collisions.push({
      bareSlug,
      entries: entries.map((e) => ({
        moduleId: e.moduleId,
        section: MODULE_SECTION[e.moduleId],
        resolvedSlug: `${e.moduleId}-${bareSlug}`,
      })),
    });
  }

  return { staged, collisions };
}

// ---------------------------------------------------------------------------
// Emit the staging tree.
// ---------------------------------------------------------------------------

function tsFileFor(item: StagedLesson): string {
  const name = camel(item.slug);
  const tagsLiteral = item.tags.length
    ? `[${item.tags.map((t) => `'${t}'`).join(', ')}]`
    : '[] /* TODO: no tag fit — Phase 2 to assign */';
  return `import body from './${item.slug}.md?raw';
import type { Nugget } from '@/types';

export const ${name}: Nugget = {
  id: '${item.slug}',
  title: '${sq(item.lesson.title)}',
  // TODO(phase-2): one plain-text sentence — what this is *for* / when to reach for it.
  summary: 'TODO: summary pending Phase 2 content pass.',
  tags: ${tagsLiteral},
  section: '${item.section}',
  body,
  format: 'guide',
};
`;
}

function sectionIndexFile(section: string, items: StagedLesson[]): string {
  const constName = section.toUpperCase().replace(/-/g, '_');
  const imports = items
    .map((it) => `import { ${camel(it.slug)} } from './${it.slug}';`)
    .join('\n');
  const arr = items.map((it) => `  ${camel(it.slug)},`).join('\n');
  return `import type { Nugget } from '@/types';
${imports}

/** Staged ${section} items (from ai-cauldron). Not yet wired into CONTENT. */
export const ${constName}: Nugget[] = [
${arr}
];
`;
}

function writeStaging(staged: StagedLesson[], collisions: Collision[]): void {
  const stagingRoot = resolve(REPO_ROOT, 'migration-staging');
  rmSync(stagingRoot, { recursive: true, force: true });
  mkdirSync(stagingRoot, { recursive: true });

  const bySection = new Map<string, StagedLesson[]>();
  for (const item of staged) {
    const arr = bySection.get(item.section) ?? [];
    arr.push(item);
    bySection.set(item.section, arr);
  }

  for (const [section, items] of bySection) {
    const dir = resolve(stagingRoot, section);
    mkdirSync(dir, { recursive: true });
    for (const item of items) {
      const body = item.lesson.content.endsWith('\n')
        ? item.lesson.content
        : `${item.lesson.content}\n`;
      writeFileSync(resolve(dir, `${item.slug}.md`), body, 'utf8');
      writeFileSync(resolve(dir, `${item.slug}.ts`), tsFileFor(item), 'utf8');
    }
    writeFileSync(
      resolve(dir, 'index.ts'),
      sectionIndexFile(section, items),
      'utf8',
    );
  }

  writeFileSync(
    resolve(stagingRoot, 'README.md'),
    stagingReadme(staged, collisions),
    'utf8',
  );
}

function stagingReadme(
  staged: StagedLesson[],
  collisions: Collision[],
): string {
  const bySection = new Map<string, number>();
  for (const it of staged)
    bySection.set(it.section, (bySection.get(it.section) ?? 0) + 1);
  const sectionRows = [...bySection.entries()]
    .map(([s, n]) => `| \`${s}\` | ${n} |`)
    .join('\n');
  const collisionRows = collisions.length
    ? collisions
        .map(
          (c) =>
            `- \`${c.bareSlug}\` — appears in ${c.entries
              .map((e) => `\`${e.moduleId}\``)
              .join(', ')} → staged as ${c.entries
              .map((e) => `\`${e.resolvedSlug}\``)
              .join(', ')}`,
        )
        .join('\n')
    : '- none';

  return `# migration-staging

Auto-generated by \`scripts/migrate-cauldron.ts\`. **Do not hand-edit** — re-run
the script instead (\`npx tsx scripts/migrate-cauldron.ts\`); it wipes and
rebuilds this directory.

This is a holding area for ai-cauldron lesson content converted into this repo's
\`.md\` + \`.ts\` guide shape. It is **not** imported by \`src/content\` and does not
appear in the app. Phase 2 agents write real \`summary\` strings, sanity-check
\`tags\`, and move pairs into \`src/content/guides/\`.

## Caveats

- Each \`.ts\` file sets \`section\` to a value (\`ai-llm-internals\`, \`ai-reasoning\`,
  \`ai-retrieval\`, \`ai-agents\`, \`ai-orchestration\`, \`ai-safety\`,
  \`ai-evaluation\`) that is **not yet in the \`Section\` union** in
  \`src/types.ts\`. Adding those is a separate task owned by another agent.
- \`format\` is \`'guide'\` for every staged item. Lessons whose body is short
  enough to be a nugget are flagged in \`MIGRATION_INVENTORY.md\` ("Proposed
  format" column) but not reshaped here.
- \`summary\` is a \`TODO:\` placeholder everywhere.

## Counts per section

| section | staged lessons |
|---|---|
${sectionRows}

Total: ${staged.length}

## Slug collisions

${collisionRows}
`;
}

// ---------------------------------------------------------------------------
// Algorithms (from ai-cauldron/src/components/rag/config.ts).
// ---------------------------------------------------------------------------

interface AlgoRow {
  id: string;
  name: string;
  loop: boolean;
  plan: string;
}

const LOOP_ALGOS = new Set(['agentic', 'self-rag', 'corrective', 'graph']);

async function loadAlgorithms(modulesDir: string): Promise<AlgoRow[]> {
  const configPath = resolve(modulesDir, '../components/rag/config.ts');
  if (!existsSync(configPath)) {
    console.warn(
      `  ! rag/config.ts not found at ${configPath} — algorithm table will be empty.`,
    );
    return [];
  }
  const ns = (await import(pathToFileURL(configPath).href)) as {
    ALGORITHMS?: readonly { id: string; name: string }[];
  };
  const algos = ns.ALGORITHMS ?? [];
  return algos.map((a) => ({
    id: a.id,
    name: a.name,
    loop: LOOP_ALGOS.has(a.id),
    plan: LOOP_ALGOS.has(a.id) ? 'stepper' : 'static (mermaid+code+trace)',
  }));
}

// ---------------------------------------------------------------------------
// MIGRATION_INVENTORY.md
// ---------------------------------------------------------------------------

function inventoryDoc(
  staged: StagedLesson[],
  collisions: Collision[],
  algos: AlgoRow[],
): string {
  const esc = (s: string) => s.replace(/\|/g, '\\|');

  // 1. Per-lesson table.
  const lessonRows = staged
    .map((it) => {
      const proposed =
        it.wordCount < 250 ? `nugget? (${it.wordCount} words)` : 'guide';
      const rel = it.lesson.relatedAlgorithmId ?? '';
      return `| ${esc(it.moduleId)}/${esc(it.bareSlug)} | ${esc(it.lesson.title)} | ${it.wordCount} | ${it.section} | ${proposed} | ${it.track} | ${it.trackOrder} | ${rel} | pending |`;
    })
    .join('\n');

  // 2. Algorithms table.
  const algoRows = algos
    .map(
      (a) =>
        `| ${a.id} | ${esc(a.name)} | ${a.loop ? 'yes' : 'no'} | ${a.plan} | pending |`,
    )
    .join('\n');

  // 3. Slug collisions.
  const collisionText = collisions.length
    ? collisions
        .map(
          (c) =>
            `- \`${c.bareSlug}\` collides across ${c.entries
              .map((e) => `\`${e.moduleId}\` (→ \`${e.section}\`)`)
              .join(
                ', ',
              )}.\n  Resolved by prefixing with the module id: ${c.entries
              .map((e) => `\`${e.resolvedSlug}\``)
              .join(
                ', ',
              )}. Non-colliding lessons keep their bare lesson id as the slug.`,
        )
        .join('\n')
    : '- None. Every lesson id is unique across all 9 modules.';

  // 4. Content notes.
  const langTotals: Record<string, number> = {};
  let bareFenceTotal = 0;
  const htmlLessons: { slug: string; tags: string[] }[] = [];
  const tableHeavy: { slug: string; count: number }[] = [];
  const broken: { slug: string; flags: string[] }[] = [];
  for (const it of staged) {
    for (const [lang, n] of Object.entries(it.fenceLangs)) {
      langTotals[lang] = (langTotals[lang] ?? 0) + n;
    }
    bareFenceTotal += it.bareFences;
    if (it.htmlTags.length)
      htmlLessons.push({
        slug: `${it.moduleId}/${it.bareSlug}`,
        tags: it.htmlTags,
      });
    if (it.tableCount > 3)
      tableHeavy.push({
        slug: `${it.moduleId}/${it.bareSlug}`,
        count: it.tableCount,
      });
    if (it.brokenFlags.length)
      broken.push({
        slug: `${it.moduleId}/${it.bareSlug}`,
        flags: it.brokenFlags,
      });
  }
  const langLine = Object.entries(langTotals)
    .sort((a, b) => b[1] - a[1])
    .map(([l, n]) => `\`${l}\` (${n})`)
    .join(', ');
  const htmlText = htmlLessons.length
    ? htmlLessons
        .map(
          (h) =>
            `- \`${h.slug}\`: ${h.tags.map((t) => `\`<${t}>\``).join(', ')}`,
        )
        .join('\n')
    : '- None. No raw HTML elements appear in any lesson body — all bodies are pure Markdown.';
  const totalTables = staged.reduce((s, it) => s + it.tableCount, 0);
  const with3Plus = staged.filter((it) => it.tableCount >= 3).length;
  const tableHeavyList = tableHeavy.length
    ? tableHeavy
        .sort((a, b) => b.count - a.count)
        .map((t) => `- \`${t.slug}\`: ~${t.count} tables`)
        .join('\n')
    : '- None with more than 3 tables.';
  const tableText = `~${totalTables} Markdown tables total across the ${staged.length} lessons; ${with3Plus} lessons have 3 or more.\n\nLessons with **more than 3** tables:\n${tableHeavyList}`;
  const brokenText = broken.length
    ? broken.map((b) => `- \`${b.slug}\`: ${b.flags.join('; ')}`).join('\n')
    : '- None. No lesson body looks truncated, unbalanced, or placeholder-only.';

  const totalWords = staged.reduce((s, it) => s + it.wordCount, 0);
  const nuggetCandidates = staged.filter((it) => it.wordCount < 250);
  const longest = [...staged]
    .sort((a, b) => b.wordCount - a.wordCount)
    .slice(0, 5);
  const shortest = [...staged]
    .sort((a, b) => a.wordCount - b.wordCount)
    .slice(0, 5);

  // 5. Link audit.
  const linkMap = new Map<string, string[]>(); // link target -> lesson slugs
  for (const it of staged) {
    for (const link of it.internalLinks) {
      const arr = linkMap.get(link) ?? [];
      arr.push(`${it.moduleId}/${it.bareSlug}`);
      linkMap.set(link, arr);
    }
  }
  const linkText = linkMap.size
    ? [...linkMap.entries()]
        .sort()
        .map(([target, slugs]) => {
          const plausible = target.startsWith('#')
            ? 'in-page anchor — fine if the heading is kept'
            : 'points at an ai-cauldron route that will NOT exist post-migration — needs rewrite or removal';
          return `- \`${target}\` (in ${slugs.map((s) => `\`${s}\``).join(', ')}) — ${plausible}`;
        })
        .join('\n')
    : '- None. No internal `](/…)` or `](#…)` markdown links appear in any lesson body. (Cross-references, where they exist, are plain prose, not links.)';

  // Section counts.
  const bySection = new Map<string, number>();
  for (const it of staged)
    bySection.set(it.section, (bySection.get(it.section) ?? 0) + 1);
  const sectionCountText = [...bySection.entries()]
    .map(([s, n]) => `- \`${s}\`: ${n}`)
    .join('\n');

  return `# Migration Inventory — ai-cauldron → develop-nuggets

Generated by \`scripts/migrate-cauldron.ts\`. Re-run the script to regenerate.

- **Source:** \`ai-cauldron/src/modules/*.ts\` — 9 modules, ${staged.length} lessons.
- **Staged to:** \`migration-staging/<section>/\` as \`.md\` + \`.ts\` guide pairs.
- **Total body size:** ~${totalWords.toLocaleString()} words across ${staged.length} lessons (avg ~${Math.round(
    totalWords / staged.length,
  )} words/lesson).

## Lessons per target section

${sectionCountText}

## 1. Lessons

\`Proposed format\` is \`guide\` unless the body is under ~250 words, in which case
it is flagged \`nugget?\` (a candidate for the nugget shape — not forced).

| Source (module/lesson id) | Title | Word count | Target section | Proposed format | Track | Track order | relatedAlgorithmId | Status |
|---|---|---|---|---|---|---|---|---|
${lessonRows}

## 2. RAG algorithm visualizations

From \`ai-cauldron/src/components/rag/config.ts\` (\`ALGORITHMS\`). "Loop-structured"
follows the migration plan: yes for \`agentic\`, \`self-rag\`, \`corrective\`, \`graph\`
(these get a \`stepper\`); the other six get a \`static (mermaid+code+trace)\` render.

| id | name | Loop-structured? | Plan | Status |
|---|---|---|---|---|
${algoRows}

## 3. Slug collisions

${collisionText}

## 4. Content notes

**Fence languages used across all lesson bodies:**
${langLine || '_none_'}${bareFenceTotal ? `\n\nPlus ${bareFenceTotal} fenced blocks with **no language tag** (plain \`\`\`\` \`\`\` \`\`\`\` fences — mostly ASCII diagrams and pipeline sketches; these render as plain \`<pre>\` and are fine).` : ''}

**Raw HTML in bodies:**
${htmlText}

**Table density (lessons with more than 3 tables — candidates for the voice-edit / de-densify pass):**
${tableText}

**Lessons that look truncated / broken:**
${brokenText}

**Size outliers:**
- Longest: ${longest.map((it) => `\`${it.moduleId}/${it.bareSlug}\` (${it.wordCount}w)`).join(', ')}
- Shortest: ${shortest.map((it) => `\`${it.moduleId}/${it.bareSlug}\` (${it.wordCount}w)`).join(', ')}
- Nugget candidates (<250 words): ${
    nuggetCandidates.length
      ? nuggetCandidates
          .map((it) => `\`${it.moduleId}/${it.bareSlug}\` (${it.wordCount}w)`)
          .join(', ')
      : 'none — every lesson is guide-length'
  }

## 5. Link audit

Every internal markdown link (\`](/…)\` or \`](#…)\`) found across all lesson bodies:

${linkText}
`;
}

// ---------------------------------------------------------------------------
// Main.
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const modulesDir = findCauldronModulesDir();
  console.log(`ai-cauldron modules: ${modulesDir}`);

  const modules = await loadModules(modulesDir);
  const totalLessons = modules.reduce((n, m) => n + m.lessons.length, 0);
  console.log(`Loaded ${modules.length} modules, ${totalLessons} lessons.`);

  const { staged, collisions } = stageLessons(modules);
  const algos = await loadAlgorithms(modulesDir);

  writeStaging(staged, collisions);
  const inventoryPath = resolve(REPO_ROOT, 'MIGRATION_INVENTORY.md');
  writeFileSync(inventoryPath, inventoryDoc(staged, collisions, algos), 'utf8');

  // Console report.
  const bySection = new Map<string, number>();
  for (const it of staged)
    bySection.set(it.section, (bySection.get(it.section) ?? 0) + 1);
  console.log('\nStaged per section:');
  for (const [s, n] of bySection) console.log(`  ${s}: ${n}`);

  const nuggetCandidates = staged.filter((it) => it.wordCount < 250);
  console.log(`\nNugget candidates (<250 words): ${nuggetCandidates.length}`);
  for (const it of nuggetCandidates) {
    console.log(`  ${it.moduleId}/${it.bareSlug} (${it.wordCount}w)`);
  }

  console.log(`\nSlug collisions: ${collisions.length}`);
  for (const c of collisions) {
    console.log(
      `  ${c.bareSlug}: ${c.entries.map((e) => `${e.moduleId} -> ${e.resolvedSlug}`).join(', ')}`,
    );
  }

  console.log(`\nWrote:`);
  console.log(
    `  migration-staging/  (${staged.length} lesson pairs + ${bySection.size} section indexes)`,
  );
  console.log(`  ${inventoryPath}`);

  // Guard: MD/TS pair count sanity.
  const mdCount = staged.length;
  if (mdCount !== totalLessons) {
    throw new Error(
      `Staged ${mdCount} lessons but loaded ${totalLessons} — mismatch.`,
    );
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
