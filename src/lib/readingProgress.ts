import { safeStorage } from './safeStorage';

const LAST_VIEWED_KEY = 'dev-nuggets:last-viewed-id';
const scrollKey = (id: string) => `dev-nuggets:scroll:${id}`;

export const readingProgress = {
  getLastViewedId(): string | undefined {
    return safeStorage.get<string | undefined>(LAST_VIEWED_KEY, undefined);
  },

  setLastViewedId(id: string): void {
    safeStorage.set(LAST_VIEWED_KEY, id);
  },

  getScrollY(id: string): number {
    return safeStorage.get<number>(scrollKey(id), 0);
  },

  setScrollY(id: string, scrollY: number): void {
    safeStorage.set(scrollKey(id), scrollY);
  },
};
