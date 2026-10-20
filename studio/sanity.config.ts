import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { esESLocale } from '@sanity/locale-es-es';
import { schemaTypes } from './schemaTypes';

// El ID del proyecto sale de sanity.io/manage. No es secreto, pero se deja en variable para no atarlo al código.
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'reemplazar';
const dataset = process.env.SANITY_STUDIO_DATASET || 'production';

export default defineConfig({
  name: 'ancestra',
  title: 'Ancestra',
  projectId,
  dataset,
  plugins: [structureTool(), esESLocale()],
  schema: { types: schemaTypes },
});
