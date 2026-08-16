import { useEffect } from 'react';

interface UseGlobalShortcutsOptions {
  onSearch: () => void;
}

/** ⌘/Ctrl+K focuses search from anywhere in the app. */
export function useGlobalShortcuts({
  onSearch,
}: UseGlobalShortcutsOptions): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;
      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onSearch();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onSearch]);
}
