/**
 * Reader-chosen accent colour. `auto` is the default and leaves the
 * per-section pillar colours alone; any other value overrides all
 * three so the whole site follows one hue.
 */
export type AccentChoice = 'auto' | 'ochre' | 'blue' | 'green' | 'purple' | 'rose';

export const ACCENT_KEY = 'portfolio:accent';

export const ACCENTS: ReadonlyArray<{ value: AccentChoice; label: string }> = [
  { value: 'auto', label: 'Per section' },
  { value: 'ochre', label: 'Ochre' },
  { value: 'blue', label: 'Blue' },
  { value: 'green', label: 'Green' },
  { value: 'purple', label: 'Purple' },
  { value: 'rose', label: 'Rose' },
];

const VALUES = new Set<string>(ACCENTS.map((a) => a.value));

export function applyAccent(choice: AccentChoice): void {
  const root = document.documentElement;
  if (choice === 'auto') delete root.dataset.accent;
  else root.dataset.accent = choice;
}

export function readAccent(): AccentChoice {
  try {
    const stored = localStorage.getItem(ACCENT_KEY);
    if (stored && VALUES.has(stored)) return stored as AccentChoice;
  } catch {
    // Storage can be blocked; fall through to the default.
  }
  return 'auto';
}

export function storeAccent(choice: AccentChoice): void {
  try {
    localStorage.setItem(ACCENT_KEY, choice);
  } catch {
    // A failed write only costs persistence, not correctness.
  }
}
