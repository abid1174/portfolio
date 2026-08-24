import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { onBookmarksChanged, readBookmarks, toggleBookmark } from '../../lib/bookmarks';

interface BookmarkButtonProps {
  /** Content id, e.g. `concepts/pkce`. */
  id: string;
  title: string;
  variant?: 'button' | 'icon';
}

export default function BookmarkButton({ id, title, variant = 'button' }: BookmarkButtonProps) {
  const [saved, setSaved] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setSaved(readBookmarks().includes(id));
    setReady(true);
    return onBookmarksChanged((ids) => setSaved(ids.includes(id)));
  }, [id]);

  const label = saved ? `Remove “${title}” from bookmarks` : `Save “${title}” to bookmarks`;

  return (
    <button
      type="button"
      className="bookmark-btn"
      data-variant={variant}
      data-saved={saved}
      aria-pressed={ready ? saved : undefined}
      aria-label={label}
      title={label}
      onClick={() => setSaved(toggleBookmark(id).includes(id))}
    >
      {saved ? (
        <BookmarkCheck size={14} strokeWidth={2} aria-hidden="true" />
      ) : (
        <Bookmark size={14} strokeWidth={2} aria-hidden="true" />
      )}
      {variant === 'button' && <span>{saved ? 'Saved' : 'Save'}</span>}
    </button>
  );
}
