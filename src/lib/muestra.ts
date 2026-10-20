import type { Mochila } from './tipos';

/**
 * Datos de muestra para desarrollar sin Sanity. Se usan solo si no hay PUBLIC_SANITY_PROJECT_ID.
 * Sin precios a propósito: los precios todavía no están definidos.
 */
const foto = (archivo: string, alt: string) => ({
  url: `/muestra/${archivo}`,
  miniatura: `/muestra/${archivo}`,
  social: `/muestra/${archivo}`,
  alt,
  ancho: 900,
  alto: 1200,
});

export const MOCHILAS_MUESTRA: Mochila[] = [
  {
    referencia: 'A001',
    slug: 'a001',
    nombre: 'Mochila Sierra',
    comunidad: 'arhuaca',
    tipo: 'unica',
    colores: [],
    precio: null,
    descripcion: 'Tejida a mano en lana por artesanas arhuacas de la Sierra Nevada de Santa Marta.',
    medidas: '30 × 25 cm',
    fotos: [foto('tierra.svg', 'Mochila arhuaca en tonos crema y café con figuras geométricas')],
    disponible: true,
  },
  {
    referencia: 'K001',
    slug: 'k001',
    nombre: 'Mochila Atánquez',
    comunidad: 'kankuama',
    tipo: 'unica',
    colores: [],
    precio: null,
    descripcion: 'Tejida en fique por artesanas kankuamas.',
    medidas: '28 × 24 cm',
    fotos: [foto('fique.svg', 'Mochila kankuama de fique en tonos naturales')],
    disponible: true,
  },
  {
    referencia: 'W001',
    slug: 'w001',
    nombre: 'Mochila Guajira',
    comunidad: 'wayuu',
    tipo: 'unica',
    colores: [],
    precio: null,
    descripcion: 'Tejida a mano por artesanas wayuu de La Guajira, con borlas.',
    medidas: '27 × 22 cm',
    fotos: [foto('wayuu.svg', 'Mochila wayuu de colores con borlas')],
    disponible: false,
  },
  {
    referencia: 'M001',
    slug: 'm001',
    nombre: 'Mochila de mostacilla Sol',
    comunidad: 'wayuu',
    tipo: 'mostacilla',
    colores: ['Dorado', 'Rojo', 'Negro'],
    precio: null,
    descripcion: 'Modelo tejido en mostacilla. Se puede pedir en varios colores.',
    medidas: '20 × 18 cm',
    fotos: [foto('mostacilla.svg', 'Mochila de mostacilla dorada')],
    disponible: true,
  },
];
