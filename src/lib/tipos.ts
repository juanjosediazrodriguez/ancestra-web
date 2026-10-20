/** Comunidades de las que vienen las mochilas. */
export const COMUNIDADES = ['wayuu', 'arhuaca', 'kankuama'] as const;
export type Comunidad = (typeof COMUNIDADES)[number];

export const NOMBRE_COMUNIDAD: Record<Comunidad, string> = {
  wayuu: 'Wayuu',
  arhuaca: 'Arhuaca',
  kankuama: 'Kankuama',
};

/**
 * - `unica`: pieza única, existencia 1. Se vende una sola vez.
 * - `mostacilla`: modelo que se repite, con colores a elegir.
 */
export type TipoMochila = 'unica' | 'mostacilla';

export interface Foto {
  /** URL de la foto grande (ficha de producto). */
  url: string;
  /** URL de la versión pequeña (tarjetas del catálogo). */
  miniatura: string;
  /** 1200×630 en JPG, para la vista previa de WhatsApp/Facebook (og:image). */
  social: string;
  /** Texto alternativo para lectores de pantalla. */
  alt: string;
  ancho: number;
  alto: number;
}

export interface Mochila {
  referencia: string;
  /** Segmento de la URL: /mochila/<slug> */
  slug: string;
  nombre: string;
  comunidad: Comunidad;
  tipo: TipoMochila;
  /** Solo para mostacilla. */
  colores: string[];
  /** En COP. `null` = precio a consultar. */
  precio: number | null;
  descripcion: string;
  medidas: string | null;
  fotos: Foto[];
  disponible: boolean;
}
