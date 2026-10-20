# AGENTS.md

Reglas para asistentes de IA que trabajen en este repo.

## Contexto

Catálogo de Ancestra (mochilas artesanales). **No hay pagos en línea**: el carrito termina en un link `wa.me`. Las usuarias del panel (Sanity Studio) **no son técnicas**: los títulos y descripciones del esquema se escriben para ellas, en español.

## Reglas

- **El sitio es estático** (`output: 'static'`). No agregar adapters, SSR ni endpoints sin discutirlo antes.
- **`src/lib/` no toca el DOM** y tiene pruebas en `tests/`. Toda la lógica nueva del carrito o del mensaje va ahí, con su prueba.
- **No usar `innerHTML` con datos del carrito.** Vienen de `localStorage` y no son confiables: construir el DOM con `textContent`.
- **Si cambias un campo en `studio/schemaTypes/`, actualiza la consulta GROQ de `src/lib/sanity.ts`.** Sanity no impone el esquema en la base.
- **No inventar precios.** `precio: null` significa "Precio a consultar".
- Accesibilidad: `alt` en todas las fotos, `label` en todos los campos, foco visible y contraste de texto ≥ 4.5:1.
- Versiones exactas en `package.json` (sin `^`).
- Antes de terminar: `npm test`, `npm run check` y `npm run build`.

## Comandos de Astro

Servidor de desarrollo en segundo plano: `astro dev --background` (`astro dev stop`, `astro dev status`, `astro dev logs`).

Documentación: https://docs.astro.build
