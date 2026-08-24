import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { Search } from 'lucide-react';

// The dialog (and, through it, Fuse and the index) is only fetched
// once someone actually opens search.
const SearchDialog = lazy(() => import('./SearchDialog'));

interface SearchCommandProps {
  /** Renders only the dialog, opened immediately — used by /search. */
  alwaysOpen?: boolean;
  initialQuery?: string;
}

export default function SearchCommand({
  alwaysOpen = false,
  initialQuery = '',
}: SearchCommandProps) {
  const [open, setOpen] = useState(alwaysOpen);
  const [isMac, setIsMac] = useState(false);

  useEffect(() => {
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  const close = useCallback(() => {
    if (alwaysOpen) {
      // On the dedicated search page there is nothing to close to.
      if (history.length > 1) history.back();
      else window.location.href = '/';
      return;
    }
    setOpen(false);
  }, [alwaysOpen]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((value) => !value);
      }
      // "/" is the other convention readers expect — but not while
      // they are typing into a field.
      if (
        event.key === '/' &&
        !event.metaKey &&
        !event.ctrlKey &&
        !(event.target instanceof HTMLInputElement) &&
        !(event.target instanceof HTMLTextAreaElement)
      ) {
        event.preventDefault();
        setOpen(true);
      }
    };

    const onRequest = () => setOpen(true);

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('portfolio:open-search', onRequest);
    // Sidebar and any other static markup can request the dialog
    // without needing to be React themselves.
    const triggers = document.querySelectorAll<HTMLElement>('[data-open-search]');
    triggers.forEach((el) => el.addEventListener('click', onRequest));

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('portfolio:open-search', onRequest);
      triggers.forEach((el) => el.removeEventListener('click', onRequest));
    };
  }, []);

  return (
    <>
      {!alwaysOpen && (
        <button type="button" className="search-trigger" onClick={() => setOpen(true)}>
          <Search size={14} strokeWidth={2} aria-hidden="true" />
          <span className="search-trigger-text">Search</span>
          <kbd aria-hidden="true">{isMac ? '⌘' : 'Ctrl '}K</kbd>
          <span className="sr-only">Search the knowledge base</span>
        </button>
      )}

      {open && (
        <Suspense fallback={null}>
          <SearchDialog onClose={close} initialQuery={initialQuery} />
        </Suspense>
      )}
    </>
  );
}
