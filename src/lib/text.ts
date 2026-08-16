/** Strips markdown syntax down to a short plain-text preview for list rows. */
export function excerpt(markdown: string, maxLength = 160): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/[*_>~-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();

  return plain.length > maxLength
    ? `${plain.slice(0, maxLength).trimEnd()}…`
    : plain;
}

export function formatDate(iso: string): string {
  // Date-only ISO strings (e.g. "2026-01-15") parse as UTC midnight — format
  // in UTC too, or a viewer west of UTC sees the previous day.
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(iso));
}
