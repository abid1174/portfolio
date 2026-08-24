import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { onBookmarksChanged, readBookmarks, writeBookmarks } from '../../lib/bookmarks';

interface BookmarkListProps {
  /** Total entries rendered on the page, all initially hidden. */
  total: number;
}

/**
 * Controller for the bookmarks page. Astro renders every card up
 * front (hidden); this island reveals the saved ones. Same trick as
 * ContentFilter — no card markup is duplicated in React.
 */
export default function BookmarkList({ total }: BookmarkListProps) {
  const [ids, setIds] = useState<string[] | null>(null);

  useEffect(() => {
    setIds(readBookmarks());
    return onBookmarksChanged(setIds);
  }, []);

  useEffect(() => {
    if (ids === null) return;
    const saved = new Set(ids);
    let shown = 0;
    document.querySelectorAll<HTMLElement>('[data-entry]').forEach((el) => {
      const match = saved.has(el.dataset.entryId ?? '');
      el.toggleAttribute('hidden', !match);
      if (match) shown += 1;
    });
    document.querySelector('[data-bookmarks-empty]')?.toggleAttribute('hidden', shown > 0);
    document.querySelector('[data-bookmarks-grid]')?.toggleAttribute('hidden', shown === 0);
  }, [ids]);

  if (ids === null) {
    return <p className="bookmark-status">Reading your saved articles…</p>;
  }

  return (
    <p className="bookmark-status" role="status">
      <span>
        <strong>{ids.length}</strong> saved {ids.length === 1 ? 'article' : 'articles'} · stored
        in this browser only
      </span>
      {ids.length > 0 && (
        <button
          type="button"
          className="filter-reset"
          onClick={() => {
            writeBookmarks([]);
            setIds([]);
          }}
        >
          <Trash2 size={12} strokeWidth={2} aria-hidden="true" />
          Clear all
        </button>
      )}
      <span className="bookmark-total">{total} articles available</span>
    </p>
  );
}
