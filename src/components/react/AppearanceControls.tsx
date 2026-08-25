import { useEffect, useRef, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { applyTheme, storeTheme } from '../../lib/theme';
import {
  ACCENTS,
  applyAccent,
  readAccent,
  storeAccent,
  type AccentChoice,
} from '../../lib/accent';

/**
 * Appearance controls: an accent swatch that opens a colour menu, and
 * a day/night toggle. The blocking script in BaseLayout has already
 * painted the stored theme and accent, so this island only takes over
 * once hydrated and there is never a flash.
 */
export default function AppearanceControls() {
  const [accent, setAccent] = useState<AccentChoice>('auto');
  const [dark, setDark] = useState(false);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAccent(readAccent());
    setDark(document.documentElement.dataset.theme === 'dark');
    setReady(true);
  }, []);

  // Dismiss the menu on an outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const pickAccent = (value: AccentChoice) => {
    setAccent(value);
    storeAccent(value);
    applyAccent(value);
    setOpen(false);
  };

  const toggleTheme = () => {
    const next = dark ? 'light' : 'dark';
    setDark(!dark);
    storeTheme(next);
    applyTheme(next);
  };

  return (
    <div className="appearance" ref={rootRef} data-ready={ready}>
      <div className="appearance-row">
        <button
          type="button"
          className="appearance-btn accent-trigger"
          aria-haspopup="true"
          aria-expanded={open}
          aria-label="Accent colour"
          title="Accent colour"
          data-open={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="swatch" data-accent={accent} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="appearance-btn"
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={dark ? 'Light theme' : 'Dark theme'}
          onClick={toggleTheme}
        >
          {dark ? (
            <Sun size={15} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Moon size={15} strokeWidth={2} aria-hidden="true" />
          )}
        </button>
      </div>

      {open && (
        <div className="accent-menu" role="menu" aria-label="Accent colour">
          {ACCENTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              role="menuitemradio"
              aria-checked={accent === value}
              aria-label={label}
              title={label}
              className="accent-option"
              data-active={accent === value}
              onClick={() => pickAccent(value)}
            >
              <span className="swatch" data-accent={value} aria-hidden="true" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
