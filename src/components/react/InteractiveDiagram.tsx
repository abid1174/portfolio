import { useState } from 'react';

export interface DiagramLayer {
  id: string;
  label: string;
  summary: string;
  detail: string;
  items?: string[];
  accent?: string;
}

interface InteractiveDiagramProps {
  layers: DiagramLayer[];
  caption?: string;
}

/**
 * A layered architecture the reader can step through. Genuinely
 * interactive (selection state), so it earns being an island —
 * everything static around it stays server-rendered.
 */
export default function InteractiveDiagram({ layers, caption }: InteractiveDiagramProps) {
  const [activeId, setActiveId] = useState(layers[0]?.id);
  const active = layers.find((layer) => layer.id === activeId) ?? layers[0];

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    const delta = event.key === 'ArrowDown' ? 1 : event.key === 'ArrowUp' ? -1 : 0;
    if (!delta) return;
    event.preventDefault();
    const next = layers[(index + delta + layers.length) % layers.length];
    setActiveId(next.id);
    document.getElementById(`layer-tab-${next.id}`)?.focus();
  };

  if (!active) return null;

  return (
    <figure className="idiagram">
      <div className="idiagram-body">
        <div
          className="idiagram-stack"
          role="tablist"
          aria-orientation="vertical"
          aria-label="Architecture layers"
        >
          {layers.map((layer, index) => (
            <button
              key={layer.id}
              id={`layer-tab-${layer.id}`}
              type="button"
              role="tab"
              aria-selected={layer.id === active.id}
              aria-controls={`layer-panel-${layer.id}`}
              tabIndex={layer.id === active.id ? 0 : -1}
              className="idiagram-layer"
              data-active={layer.id === active.id}
              style={
                layer.accent
                  ? ({ '--layer-accent': layer.accent } as React.CSSProperties)
                  : undefined
              }
              onClick={() => setActiveId(layer.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
            >
              <span className="idiagram-index" aria-hidden="true">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="idiagram-layer-text">
                <span className="idiagram-label">{layer.label}</span>
                <span className="idiagram-summary">{layer.summary}</span>
              </span>
            </button>
          ))}
        </div>

        <div
          className="idiagram-panel"
          id={`layer-panel-${active.id}`}
          role="tabpanel"
          aria-labelledby={`layer-tab-${active.id}`}
          tabIndex={0}
        >
          <h3>{active.label}</h3>
          <p>{active.detail}</p>
          {active.items && active.items.length > 0 && (
            <ul>
              {active.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
