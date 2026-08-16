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
