/**
 * Heading-anchor slugs, shared by two call sites that must agree:
 * `MarkdownRenderer` (stamps `id`s on rendered headings) and
 * `extractHeadings` (builds the table-of-contents link list). Both run the
 * same `slugify` + `dedupe` so a TOC link always resolves to a real anchor.
 */

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Given a base slug and a running seen-count map, return the base unchanged
 * the first time and `base-2`, `base-3`, … on repeats — matching the
 * disambiguation the renderer applies within one document.
 */
export function dedupe(base: string, seen: Map<string, number>): string {
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count === 0 ? base : `${base}-${count + 1}`;
}

export interface Heading {
  depth: 2 | 3;
  text: string;
  id: string;
}

/**
 * Pull `##` / `###` headings out of a markdown body for a table of contents.
 * Ignores headings inside fenced code blocks and strips any trailing `#`
 * (ATX-closed headings). Slugs are deduped the same way the renderer does.
 */
export function extractHeadings(markdown: string): Heading[] {
  const seen = new Map<string, number>();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2].trim();
    headings.push({ depth, text, id: dedupe(slugify(text), seen) });
  }

  return headings;
}
