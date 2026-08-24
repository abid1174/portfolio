import Callout from './Callout.astro';
import Capacity from './Capacity.astro';
import Decision from './Decision.astro';
import Mermaid from './Mermaid.astro';
import ModelComparison from './ModelComparison.astro';
import PromptExample from './PromptExample.astro';
import Table from './Table.astro';
import Tradeoff from './Tradeoff.astro';
import ArchitectureDiagram from '../astro/ArchitectureDiagram.astro';

/**
 * Auto-injected into every MDX article via `<Content components={...} />`.
 * Authors use these tags without an import, which keeps content files
 * portable if the rendering layer is ever replaced.
 */
export const mdxComponents = {
  Callout,
  Capacity,
  Decision,
  Mermaid,
  ModelComparison,
  PromptExample,
  Tradeoff,
  ArchitectureDiagram,
  table: Table,
};
