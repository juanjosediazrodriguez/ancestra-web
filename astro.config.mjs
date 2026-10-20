// @ts-check
import { defineConfig } from 'astro/config';

// Sitio 100 % estático: Cloudflare Pages sirve el contenido de dist/.
// https://astro.build/config
export default defineConfig({
  site: 'https://ancestra.example', // TODO: reemplazar por el dominio real cuando se compre
  output: 'static',
  trailingSlash: 'ignore',
});
