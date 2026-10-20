// @ts-check
import { defineConfig } from 'astro/config';

// Dominio público, usado para la URL canónica y las vistas previas (Open Graph).
// - SITE_URL: la dirección pública (https://<proyecto>.pages.dev, o el dominio cuando se compre).
// - CF_PAGES_URL: respaldo que Cloudflare define solo; ojo, es la URL de ESE despliegue (con hash), no la principal.
// Sin ninguna (desarrollo local), Astro usa la URL de la petición.
/** @type {Record<string, string | undefined>} */
const env = /** @type {any} */ (globalThis).process?.env ?? {};
const site = env.SITE_URL || env.CF_PAGES_URL || undefined;

// Sitio 100 % estático: Cloudflare Pages sirve el contenido de dist/.
// https://astro.build/config
export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'ignore',
});
