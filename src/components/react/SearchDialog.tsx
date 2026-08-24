import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CornerDownLeft, Loader2, Search as SearchIcon, X } from 'lucide-react';
import type { SearchDoc } from '../../lib/search-schema';
import { fuseOptions } from '../../lib/search-schema';

type FuseLike = { search: (q: string) => Array<{ item: SearchDoc }> };

const PILLAR_ORDER = ['concepts', 'system-design', 'ai'] as const;
const PILLAR_LABEL: Record<string, string> = {
  concepts: 'Concepts',
  'system-design': 'System Design',
  ai: 'AI Learning',
};
const PILLAR_CLASS: Record<string, string> = {
  concepts: 'pillar-concepts',
  'system-design': 'pillar-system-design',
  ai: 'pillar-ai',
};

const MAX_PER_GROUP = 5;

interface SearchDialogProps {
  onClose: () => void;
  /** Pre-fills the input, used by the /search page deep link. */
  initialQuery?: string;
}

export default function SearchDialog({ onClose, initialQuery = '' }: SearchDialogProps) {
  const [query, setQuery] = useState(initialQuery);
  const [docs, setDocs] = useState<SearchDoc[] | null>(null);
  const [fuse, setFuse] = useState<FuseLike | null>(null);
  const [active, setActive] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  /* --- Load the index and the matcher, both lazily --- */
  useEffect(() => {
    let cancelled = false;
    async function load() {
      const [indexResponse, FuseModule] = await Promise.all([
        fetch('/search-index.json'),
        import('fuse.js'),
      ]);
      const data: SearchDoc[] = await indexResponse.json();
      if (cancelled) return;
      setDocs(data);
      setFuse(new FuseModule.default(data, fuseOptions) as unknown as FuseLike);
    }
    void load().catch(() => {
      if (!cancelled) setDocs([]);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  /* --- Focus management --- */
  useEffect(() => {
    previouslyFocused.current = document.activeElement as HTMLElement;
    inputRef.current?.focus();
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = overflow;
      previouslyFocused.current?.focus?.();
    };
  }, []);

  /* --- Results, grouped by pillar --- */
  const groups = useMemo(() => {
    if (!docs) return [];
    const matched =
      query.trim().length < 2 ? docs : (fuse?.search(query).map((result) => result.item) ?? []);

    return PILLAR_ORDER.map((pillar) => ({
      pillar,
      label: PILLAR_LABEL[pillar],
      items: matched.filter((doc) => doc.pillar === pillar).slice(0, MAX_PER_GROUP),
    })).filter((group) => group.items.length > 0);
  }, [docs, fuse, query]);

  // Flattened order is what the arrow keys walk.
  const flat = useMemo(() => groups.flatMap((group) => group.items), [groups]);

  useEffect(() => setActive(0), [query]);

  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const go = useCallback((doc: SearchDoc | undefined) => {
    if (!doc) return;
    window.location.href = doc.url;
  }, []);

  useEffect(() => {
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [onClose]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => (flat.length ? (i + 1) % flat.length : 0));
      return;
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => (flat.length ? (i - 1 + flat.length) % flat.length : 0));
      return;
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      go(flat[active]);
      return;
    }
    // Keep focus inside the dialog: the input is the only tab stop
    // that matters, so cycle back to it.
    if (event.key === 'Tab' && !event.shiftKey && event.target === inputRef.current) {
      const close =
        listRef.current?.parentElement?.querySelector<HTMLElement>('[data-search-close]');
      if (close) {
        event.preventDefault();
        close.focus();
      }
    }
  };

  const loading = docs === null;
  const empty = !loading && flat.length === 0;
  let cursor = -1;

  return (
    // The scrim is decorative: it closes on a direct click, and
    // keyboard users close with Escape (handled above, at document
    // level). There is no keyboard equivalent to add here.
    <div
      className="search-scrim"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="search-dialog"
        role="dialog"
        aria-modal="true"
        aria-label="Search the knowledge base"
      >
        <div className="search-field">
          <SearchIcon size={16} strokeWidth={2} aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search concepts, system designs, AI notes…"
            aria-label="Search query"
            autoComplete="off"
            spellCheck={false}
            enterKeyHint="go"
          />
          {loading && <Loader2 className="search-spinner" size={14} aria-hidden="true" />}
          <button
            type="button"
            data-search-close
            className="search-close"
            onClick={onClose}
            aria-label="Close search"
          >
            <X size={14} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        <div
          className="search-results"
          ref={listRef}
          role="listbox"
          aria-label="Search results"
        >
          {loading && <p className="search-status">Loading index…</p>}

          {empty && (
            <p className="search-status">
              No matches for <strong>{query}</strong>. Try a broader term — “oauth”, “cache”,
              “retrieval”.
            </p>
          )}

          {groups.map((group) => (
            <section key={group.pillar} className={PILLAR_CLASS[group.pillar]}>
              <h2 className="search-group">{group.label}</h2>
              <ul>
                {group.items.map((doc) => {
                  cursor += 1;
                  const index = cursor;
                  return (
                    <li key={doc.id}>
                      <a
                        href={doc.url}
                        role="option"
                        aria-selected={index === active}
                        data-active={index === active}
                        onMouseEnter={() => setActive(index)}
                        onFocus={() => setActive(index)}
                      >
                        <span className="search-item-main">
                          <span className="search-item-title">{doc.title}</span>
                          <span className="search-item-desc">{doc.description}</span>
                        </span>
                        <span className="search-item-meta">
                          <span>{doc.category}</span>
                          <span className="search-item-time">{doc.readingTime} min</span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>

        <footer className="search-foot">
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>
          <span>
            <kbd>
              <CornerDownLeft size={9} strokeWidth={2.5} aria-hidden="true" />
            </kbd>{' '}
            open
          </span>
          <span>
            <kbd>esc</kbd> close
          </span>
          <span className="search-count">{docs ? `${docs.length} entries indexed` : '—'}</span>
        </footer>
      </div>
    </div>
  );
}
