/**
 * Thin localStorage wrapper that never throws. Private browsing / quota-exceeded /
 * storage-disabled environments can all make localStorage inaccessible — callers
 * should degrade to an empty/default value rather than crash the app.
 */
export const safeStorage = {
  get<T>(key: string, fallback: T): T {
    try {
      const raw = window.localStorage.getItem(key);
      return raw === null ? fallback : (JSON.parse(raw) as T);
    } catch {
      return fallback;
    }
  },

  set(key: string, value: unknown): boolean {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
};
