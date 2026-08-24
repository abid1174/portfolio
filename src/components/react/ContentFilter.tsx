import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface ContentFilterProps {
  categories: string[];
  difficulties?: string[];
  /** Label for the free-text field, e.g. "Search concepts…". */
  placeholder?: string;
  /** Total number of entries rendered on the page, for the counter. */
  total: number;
  unit: string;
}

const ALL = 'All';

/**
 * Controls only. The cards themselves are server-rendered by Astro and
 * simply toggled here — so the full library is in the HTML for search
 * engines and no-JS readers, and this island stays tiny.
 */
export default function ContentFilter({
  categories,
  difficulties = [],
  placeholder = 'Search…',
  total,
  unit,
}: ContentFilterProps) {
  const [category, setCategory] = useState(ALL);
  const [difficulty, setDifficulty] = useState(ALL);
  const [tag, setTag] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(total);
  const initialised = useRef(false);

  /* --- Adopt filters from the URL so links like
         /concepts?tag=caching land pre-filtered --- */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlCategory = params.get('category');
    const urlTag = params.get('tag');
    const urlDifficulty = params.get('difficulty');
    const urlQuery = params.get('q');
    if (urlCategory && categories.includes(urlCategory)) setCategory(urlCategory);
    if (urlTag) setTag(urlTag);
    if (urlDifficulty && difficulties.includes(urlDifficulty)) setDifficulty(urlDifficulty);
    if (urlQuery) setQuery(urlQuery);
    initialised.current = true;
    // `categories`/`difficulties` are static props from Astro.
  }, [categories, difficulties]);

  const matcher = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const wantedTag = tag?.toLowerCase() ?? null;
    return (el: HTMLElement) => {
      if (category !== ALL && el.dataset.category !== category) return false;
      if (difficulty !== ALL && el.dataset.difficulty !== difficulty) return false;
      if (wantedTag && !(el.dataset.tags ?? '').split('|').includes(wantedTag)) return false;
      if (needle && !(el.dataset.haystack ?? '').includes(needle)) return false;
      return true;
    };
  }, [category, difficulty, tag, query]);

  /* --- Apply to the DOM --- */
  useEffect(() => {
    const entries = document.querySelectorAll<HTMLElement>('[data-entry]');
    let shown = 0;
    entries.forEach((el) => {
      const match = matcher(el);
      el.toggleAttribute('hidden', !match);
      if (match) shown += 1;
    });

    // Hide category sections that have nothing left in them.
    document.querySelectorAll<HTMLElement>('[data-group]').forEach((group) => {
      const any = group.querySelector('[data-entry]:not([hidden])');
      group.toggleAttribute('hidden', !any);
    });

    const emptyState = document.querySelector<HTMLElement>('[data-empty-state]');
    emptyState?.toggleAttribute('hidden', shown > 0);

    setVisible(shown);
  }, [matcher]);

  /* --- Keep the URL shareable --- */
  useEffect(() => {
    if (!initialised.current) return;
    const params = new URLSearchParams();
    if (category !== ALL) params.set('category', category);
    if (difficulty !== ALL) params.set('difficulty', difficulty);
    if (tag) params.set('tag', tag);
    if (query.trim()) params.set('q', query.trim());
    const search = params.toString();
    history.replaceState(null, '', search ? `?${search}` : window.location.pathname);
  }, [category, difficulty, tag, query]);

  const reset = useCallback(() => {
    setCategory(ALL);
    setDifficulty(ALL);
    setTag(null);
    setQuery('');
  }, []);

  const filtered =
    category !== ALL || difficulty !== ALL || tag !== null || query.trim() !== '';

  return (
    <div className="filter">
      <div className="filter-search">
        <Search size={15} strokeWidth={2} aria-hidden="true" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button type="button" onClick={() => setQuery('')} aria-label="Clear search text">
            <X size={13} strokeWidth={2} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="filter-row" role="group" aria-label="Filter by category">
        {[ALL, ...categories].map((value) => (
          <button
            key={value}
            type="button"
            className="chip"
            data-active={category === value}
            aria-pressed={category === value}
            onClick={() => setCategory(value)}
          >
            {value}
          </button>
        ))}
      </div>

      {difficulties.length > 0 && (
        <div className="filter-row is-secondary" role="group" aria-label="Filter by difficulty">
          {[ALL, ...difficulties].map((value) => (
            <button
              key={value}
              type="button"
              className="chip is-level"
              data-active={difficulty === value}
              aria-pressed={difficulty === value}
              onClick={() => setDifficulty(value)}
            >
              {value}
            </button>
          ))}
        </div>
      )}

      <p className="filter-status" role="status">
        <span>
          Showing <strong>{visible}</strong> of {total} {unit}
        </span>
        {tag && (
          <button type="button" className="filter-tag" onClick={() => setTag(null)}>
            tag: {tag}
            <X size={11} strokeWidth={2.5} aria-hidden="true" />
          </button>
        )}
        {filtered && (
          <button type="button" className="filter-reset" onClick={reset}>
            Reset filters
          </button>
        )}
      </p>
    </div>
  );
}
