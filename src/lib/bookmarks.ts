export const BOOKMARK_KEY = 'portfolio:bookmarks';
export const BOOKMARK_EVENT = 'portfolio:bookmarks-changed';

/**
 * Bookmarks live in localStorage only — no account, no server. The
 * shape is a flat array of content ids (`concepts/pkce`), which is
 * exactly what a server-side store would key on later.
 */
export function readBookmarks(): string[] {
  try {
    const raw = localStorage.getItem(BOOKMARK_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === 'string')
      : [];
  } catch {
    // Corrupt or blocked storage behaves as "nothing saved".
    return [];
  }
}

export function writeBookmarks(ids: string[]): void {
  try {
    localStorage.setItem(BOOKMARK_KEY, JSON.stringify(ids));
  } catch {
    // Persistence is best-effort; the UI still reflects the change.
  }
  // Same-tab listeners (`storage` only fires cross-tab).
  document.dispatchEvent(new CustomEvent(BOOKMARK_EVENT, { detail: ids }));
}

export function toggleBookmark(id: string): string[] {
  const current = readBookmarks();
  const next = current.includes(id) ? current.filter((v) => v !== id) : [...current, id];
  writeBookmarks(next);
  return next;
}

/** Subscribes to changes from this tab and from other tabs. */
export function onBookmarksChanged(handler: (ids: string[]) => void): () => void {
  const local = (event: Event) => handler((event as CustomEvent<string[]>).detail);
  const cross = (event: StorageEvent) => {
    if (event.key === BOOKMARK_KEY) handler(readBookmarks());
  };
  document.addEventListener(BOOKMARK_EVENT, local);
  window.addEventListener('storage', cross);
  return () => {
    document.removeEventListener(BOOKMARK_EVENT, local);
    window.removeEventListener('storage', cross);
  };
}
