import { useEffect } from 'react';

interface KeyboardShortcutsModalProps {
  open: boolean;
  onClose: () => void;
}

const SHORTCUTS: { keys: string; description: string }[] = [
  { keys: '⌘K / Ctrl K', description: 'Focus search' },
  { keys: 'j', description: 'Next item in this track or section' },
  { keys: 'k', description: 'Previous item in this track or section' },
  { keys: '?', description: 'Show this help' },
];

/** The `?` shortcut opens this. Escape or a backdrop click closes it. */
export function KeyboardShortcutsModal({
  open,
  onClose,
}: KeyboardShortcutsModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Keyboard shortcuts"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative w-full max-w-sm rounded-lg border border-border bg-bg-primary p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-text-primary">
            Keyboard shortcuts
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-md px-2 py-1 text-text-tertiary transition-colors hover:bg-bg-tertiary"
          >
            ✕
          </button>
        </div>
        <dl className="flex flex-col gap-2">
          {SHORTCUTS.map((shortcut) => (
            <div
              key={shortcut.keys}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <dt className="text-text-secondary">{shortcut.description}</dt>
              <dd>
                <kbd className="rounded border border-border bg-bg-tertiary px-1.5 py-0.5 text-xs font-medium text-text-primary">
                  {shortcut.keys}
                </kbd>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
