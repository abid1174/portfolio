import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';
import { applyTheme, readTheme, storeTheme, type ThemeChoice } from '../../lib/theme';

const options: Array<{ value: ThemeChoice; label: string; Icon: typeof Sun }> = [
  { value: 'light', label: 'Light', Icon: Sun },
  { value: 'dark', label: 'Dark', Icon: Moon },
  { value: 'system', label: 'System', Icon: Monitor },
];

/**
 * Three-way theme control. The blocking script in BaseLayout has
 * already painted the correct theme; this island only takes over
 * once hydrated, so there is never a flash.
 */
export default function ThemeSwitcher() {
  const [choice, setChoice] = useState<ThemeChoice>('dark');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setChoice(readTheme());
    setReady(true);
  }, []);

  // Track the OS preference while the user is on "system".
  useEffect(() => {
    if (choice !== 'system') return;
    const query = window.matchMedia('(prefers-color-scheme: light)');
    const sync = () => applyTheme('system');
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, [choice]);

  const select = (value: ThemeChoice) => {
    setChoice(value);
    storeTheme(value);
    applyTheme(value);
  };

  return (
    <div
      className="theme-switcher"
      role="radiogroup"
      aria-label="Colour theme"
      data-ready={ready}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={ready ? choice === value : undefined}
          aria-label={`${label} theme`}
          title={`${label} theme`}
          className="theme-option"
          data-active={ready && choice === value}
          onClick={() => select(value)}
        >
          <Icon size={13} strokeWidth={2} aria-hidden="true" />
        </button>
      ))}
    </div>
  );
}
