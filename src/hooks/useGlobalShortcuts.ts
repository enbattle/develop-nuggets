import { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  contentPath,
  getContent,
  sectionNeighbors,
  trackNeighbors,
} from '@/content';
import { trackForItem } from '@/content/tracks';

interface UseGlobalShortcutsOptions {
  onSearch: () => void;
}

interface UseGlobalShortcutsResult {
  /** Whether the keyboard-shortcuts help modal is open (toggled by `?`). */
  shortcutsOpen: boolean;
  closeShortcuts: () => void;
}

const CONTENT_PATH = /^\/(?:nuggets|guides)\/([^/]+)$/;

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
}

/**
 * App-wide keyboard shortcuts:
 * - ⌘/Ctrl+K focuses search (works anywhere, including inputs)
 * - `j` / `k` page to the next / previous item — in track order when the
 *   current item belongs to a track, else in section order — only on a
 *   content page
 * - `?` toggles the shortcuts help modal
 *
 * `j` / `k` / `?` are ignored while typing in a field and while the modal
 * is open.
 */
export function useGlobalShortcuts({
  onSearch,
}: UseGlobalShortcutsOptions): UseGlobalShortcutsResult {
  const navigate = useNavigate();
  const location = useLocation();
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const closeShortcuts = useCallback(() => setShortcutsOpen(false), []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const meta = event.metaKey || event.ctrlKey;

      if (meta && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onSearch();
        return;
      }

      if (meta || event.altKey) return;
      if (isTypingTarget(event.target)) return;
      if (shortcutsOpen) return;

      if (event.key === '?') {
        event.preventDefault();
        setShortcutsOpen((open) => !open);
        return;
      }

      if (event.key !== 'j' && event.key !== 'k') return;

      const match = CONTENT_PATH.exec(location.pathname);
      if (!match) return;
      const item = getContent(match[1]);
      if (!item) return;

      const { prev, next } = trackForItem(item.id)
        ? trackNeighbors(item)
        : sectionNeighbors(item);
      const target = event.key === 'j' ? next : prev;
      if (target) {
        event.preventDefault();
        navigate(contentPath(target));
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onSearch, shortcutsOpen, navigate, location.pathname]);

  return { shortcutsOpen, closeShortcuts };
}
