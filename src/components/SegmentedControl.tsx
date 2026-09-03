/**
 * A "pick exactly one of N" control, rendered as one connected unit — a
 * tinted track with the active option lifted onto the surface colour. Used
 * for every single-select toggle in the app (domain, format, list density),
 * so they read as the same kind of thing (Law of Similarity) and match the
 * segmented control people know from other apps (Jakob's Law).
 */

interface SegmentedControlProps<T extends string> {
  /** Accessible name for the group. */
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  /** `sm` for secondary/view toggles, `md` (default) for filters. */
  size?: 'sm' | 'md';
  /** Fill the container width with equal-width segments (sidebar switcher). */
  stretch?: boolean;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  stretch = false,
}: SegmentedControlProps<T>) {
  const pad = size === 'sm' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-sm';

  return (
    <div
      role="group"
      aria-label={label}
      className={`${stretch ? 'flex w-full' : 'inline-flex'} gap-0.5 rounded-md bg-bg-tertiary p-0.5`}
    >
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={`${stretch ? 'flex-1' : ''} rounded ${pad} font-medium leading-tight transition-colors ${
              active
                ? 'bg-bg-primary text-text-primary shadow-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
