import { useEffect, useRef, useState } from 'react';

interface MermaidDiagramProps {
  chart: string;
  id: string;
}

/** Reads the live token values so diagrams follow the active theme. */
function themeVariables() {
  const css = getComputedStyle(document.documentElement);
  const token = (name: string, fallback: string) =>
    css.getPropertyValue(name).trim() || fallback;

  const line = token('--border-strong', '#303950');
  const text = token('--text-primary', '#e9edf5');
  const surface = token('--surface-raised', '#131722');
  const accent = token('--pillar', '#5b8cff');

  return {
    background: 'transparent',
    primaryColor: surface,
    primaryTextColor: text,
    primaryBorderColor: accent,
    secondaryColor: token('--surface-inset', '#0c0f17'),
    tertiaryColor: surface,
    lineColor: line,
    textColor: token('--text-secondary', '#a3adc2'),
    mainBkg: surface,
    nodeBorder: accent,
    clusterBkg: 'transparent',
    clusterBorder: line,
    edgeLabelBackground: token('--bg-primary', '#07080c'),
    fontFamily: token('--font-jetbrains', 'ui-monospace') + ', ui-monospace, monospace',
    fontSize: '14px',
    actorBkg: surface,
    actorBorder: accent,
    actorTextColor: text,
    actorLineColor: line,
    signalColor: token('--text-secondary', '#a3adc2'),
    signalTextColor: text,
    labelBoxBkgColor: surface,
    labelBoxBorderColor: line,
    labelTextColor: text,
    loopTextColor: text,
    noteBkgColor: token('--surface-inset', '#0c0f17'),
    noteBorderColor: line,
    noteTextColor: text,
    sequenceNumberColor: token('--text-inverted', '#07080c'),
  };
}

/**
 * Renders a Mermaid diagram. Mermaid is a large dependency, so it is
 * imported dynamically inside the effect — the module is only fetched
 * for visitors who actually scroll a diagram into view.
 */
export default function MermaidDiagram({ chart, id }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: 'strict',
          theme: 'base',
          themeVariables: themeVariables(),
          // Render at natural size: scaling a wide flowchart down to
          // the column width makes its labels unreadable. The framed
          // container scrolls horizontally instead.
          flowchart: { curve: 'basis', padding: 14, useMaxWidth: false },
          sequence: { useMaxWidth: false, mirrorActors: false, wrap: true },
        });
        const { svg } = await mermaid.render(id, chart);
        if (cancelled || !containerRef.current) return;
        containerRef.current.innerHTML = svg;
        setStatus('ready');
      } catch {
        if (!cancelled) setStatus('error');
      }
    }

    void render();

    // Re-render when the theme flips so colours stay in step.
    const observer = new MutationObserver(() => void render());
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [chart, id]);

  if (status === 'error') {
    // Falling back to the source is more useful than an empty box.
    return (
      <pre className="mermaid-fallback">
        <code>{chart}</code>
      </pre>
    );
  }

  return (
    <div
      ref={containerRef}
      className="mermaid-canvas"
      data-status={status}
      role="img"
      aria-label="Architecture diagram"
    />
  );
}
