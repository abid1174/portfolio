export type ThemeChoice = 'system' | 'light' | 'dark';

export const THEME_KEY = 'portfolio:theme';

/**
 * Applies a theme choice to the document. `system` removes the
 * attribute so the CSS `prefers-color-scheme` default takes over.
 */
export function applyTheme(choice: ThemeChoice): void {
  const root = document.documentElement;
  const resolved =
    choice === 'system'
      ? window.matchMedia('(prefers-color-scheme: light)').matches
        ? 'light'
        : 'dark'
      : choice;
  root.dataset.theme = resolved;
  root.dataset.themeChoice = choice;
}

export function readTheme(): ThemeChoice {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored;
  } catch {
    // Storage can be blocked; fall through to the default.
  }
  return 'light';
}

export function storeTheme(choice: ThemeChoice): void {
  try {
    localStorage.setItem(THEME_KEY, choice);
  } catch {
    // A failed write only costs persistence, not correctness.
  }
}
