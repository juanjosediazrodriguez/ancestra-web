import { MOCHILAS_MUESTRA } from './muestra';
import { mochilasDeSanity, sanityConfigurado } from './sanity';
import type { Mochila } from './tipos';

/** `true` si el sitio está mostrando datos de muestra en vez de los de Sanity. */
export const usandoMuestra = !sanityConfigurado;

let cache: Promise<Mochila[]> | null = null;

/** Todas las mochilas: disponibles primero. Se pide una sola vez por build. */
export function obtenerMochilas(): Promise<Mochila[]> {
  cache ??= sanityConfigurado ? mochilasDeSanity() : Promise.resolve(MOCHILAS_MUESTRA);
  return cache;
}

export const numeroWhatsApp = (import.meta.env.PUBLIC_WHATSAPP_NUMBER ?? '').trim();
