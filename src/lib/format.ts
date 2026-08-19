import type { Nugget } from '@/types';

/**
 * Display label per content format. A `Record` keyed by the `format` union
 * (not a per-format `if`/ternary) so TypeScript forces every call site to
 * handle a new format the moment one is added to the union, instead of
 * silently missing it.
 */
export const FORMAT_LABELS: Record<Nugget['format'], string> = {
  nugget: 'Nugget',
  guide: 'Guide',
};
