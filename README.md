# ancestra-web

Catálogo web de **Ancestra · Arte & Tradición** ([@mochilasancestra](https://www.instagram.com/mochilasancestra/)): mochilas hechas a mano por artesanos wayuu, arhuacos y kankuamos.

**Fase 1: catálogo con cierre por WhatsApp.** La clienta arma un carrito y, al finalizar, se abre WhatsApp con el pedido ya escrito. El pago (transferencia), la cotización de Servientrega y el despacho se hacen en el chat. No hay pagos en la página.

## Stack

| Pieza | Qué es |
|---|---|
| [Astro](https://astro.build) | Sitio **100 % estático**: el HTML se genera al publicar y no hay servidor |
| [Sanity](https://www.sanity.io) | CMS donde las dueñas suben las mochilas (carpeta `studio/`) |
| Cloudflare Pages | Hosting del sitio, en el plan gratis |
| Vitest | Pruebas del carrito y del mensaje de WhatsApp |

```
├── src/
│   ├── lib/           lógica sin DOM: tipos, carrito, mensaje de WhatsApp, consulta a Sanity
│   ├── scripts/       código que solo corre en el navegador (localStorage)
│   ├── components/    TarjetaMochila
│   ├── layouts/       Base (encabezado, pie, aviso de datos de muestra)
│   └── pages/         inicio, catálogo, ficha /mochila/[slug], carrito, 404
├── studio/            Sanity Studio (proyecto aparte, con su propio package.json)
├── tests/             pruebas unitarias
└── public/muestra/    imágenes de los datos de muestra
```

## Desarrollo

Requiere Node 22.22 o superior (ver `.nvmrc`).

```powershell
npm install
copy .env.example .env    # y completar los valores
npm run dev               # http://localhost:4321
npm test                  # pruebas
npm run check             # tipos de Astro y TypeScript
npm run build             # genera dist/
```

**Sin `PUBLIC_SANITY_PROJECT_ID`, el sitio usa los datos de `src/lib/muestra.ts`** y muestra un aviso arriba. Así se puede trabajar sin cuenta de Sanity. Sin `PUBLIC_WHATSAPP_NUMBER`, el botón de finalizar no aparece.

## Configurar Sanity (una sola vez)

1. Crear el proyecto en [sanity.io/manage](https://www.sanity.io/manage), con dataset `production` y **visibilidad pública** (solo lectura: el catálogo es público).
2. Copiar el *Project ID* en:
   - `.env` de la raíz → `PUBLIC_SANITY_PROJECT_ID`
   - `studio/.env` → `SANITY_STUDIO_PROJECT_ID`
3. Instalar y abrir el Studio:
   ```powershell
   cd studio
   npm install
   npx sanity login
   npm run dev          # http://localhost:3333
   npm run deploy       # lo publica en https://ancestra.sanity.studio
   ```
4. En *Manage → Members*, invitar a las dueñas con su correo. Entran con Google o con correo; **no necesitan GitHub**.

## Publicar en Cloudflare Pages

1. *Workers & Pages → Create → Pages → Connect to Git* → este repo.
2. Build command: `npm run build` · Output directory: `dist`.
3. Variables de entorno: `PUBLIC_SANITY_PROJECT_ID`, `PUBLIC_SANITY_DATASET=production`, `PUBLIC_WHATSAPP_NUMBER`, `NODE_VERSION=24` y **`SITE_URL`** con la dirección pública: primero `https://<proyecto>.pages.dev` y después el dominio, cuando exista. Es la que usan los links del pedido y las vistas previas de WhatsApp.
4. *Settings → Builds → Deploy hooks* → crear uno y copiar la URL.
5. En Sanity, *Manage → API → Webhooks* → crear un webhook:
   - URL: la del *deploy hook*
   - Dataset: `production`
   - Trigger: *create, update, delete*
   - Filtro: `_type == "mochila"`
   - Método HTTP: `POST`

Con esto, cada vez que una dueña publica o marca una mochila como vendida, el sitio se vuelve a construir solo en ~1–2 minutos.

## Respaldo del contenido

El contenido vive en Sanity. Para no depender de ellos, exportar cada cierto tiempo:

```powershell
cd studio
npm run export    # deja respaldos/production.tar.gz (no se sube a git)
```

Guardar también los originales de las fotos fuera de Sanity.

## Pendiente

- [ ] Páginas: *Nuestra historia y artesanos*, *Envíos y devoluciones*, *Términos* y *Privacidad*. Las exige la Ley 1480 (art. 50) para venta a distancia, aunque el pago sea por WhatsApp.
- [ ] Dominio (`.com` o `.com.co`) y la variable `SITE_URL` en Cloudflare.
- [ ] Logo real y fotos reales.
- [ ] Precios, cuando se definan. Mientras tanto, "Precio a consultar".
