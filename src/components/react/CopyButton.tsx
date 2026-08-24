import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';

interface CopyButtonProps {
  /** Text placed on the clipboard. */
  value: string;
  /** Describes what is being copied, for screen readers. */
  label?: string;
}

/**
 * Small clipboard island. Rendered next to code and prompt blocks;
 * hydrated with `client:visible` so it costs nothing above the fold.
 */
export default function CopyButton({ value, label = 'code' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access can be denied; leaving the icon unchanged
      // is a truthful signal that nothing was copied.
      setCopied(false);
    }
  }, [value]);

  return (
    <button
      type="button"
      onClick={copy}
      className="copy-btn"
      aria-label={copied ? `Copied ${label}` : `Copy ${label} to clipboard`}
    >
      {copied ? (
        <Check size={13} strokeWidth={2.5} aria-hidden="true" />
      ) : (
        <Copy size={13} strokeWidth={2} aria-hidden="true" />
      )}
      <span aria-hidden="true">{copied ? 'Copied' : 'Copy'}</span>
    </button>
  );
}
