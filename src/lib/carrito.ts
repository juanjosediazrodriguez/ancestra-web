import type { TipoMochila } from './tipos';

/** Una línea del carrito. Se guarda en localStorage, así que solo lleva datos simples. */
export interface ItemCarrito {
  referencia: string;
  /** Segmento de la URL de la ficha (/mochila/<slug>), para poner el link en el mensaje. */
  slug: string;
  nombre: string;
  tipo: TipoMochila;
  /** Solo mostacilla. */
  color: string | null;
  cantidad: number;
  /** En COP, o `null` si es "precio a consultar". */
  precio: number | null;
}

export const MAX_CANTIDAD_MOSTACILLA = 10;

/** Dos líneas son la misma si coinciden referencia y color. */
const mismaLinea = (a: ItemCarrito, referencia: string, color: string | null) =>
  a.referencia === referencia && a.color === color;

/**
 * Agrega un producto. Funciones puras: devuelven un carrito nuevo y no modifican el original.
 * Una pieza única nunca pasa de cantidad 1, porque solo existe una.
 */
export function agregar(carrito: ItemCarrito[], item: ItemCarrito): ItemCarrito[] {
  const max = item.tipo === 'unica' ? 1 : MAX_CANTIDAD_MOSTACILLA;
  const color = item.tipo === 'unica' ? null : item.color;
  const existente = carrito.find((i) => mismaLinea(i, item.referencia, color));

  if (existente) {
    return carrito.map((i) =>
      i === existente ? { ...i, cantidad: Math.min(max, i.cantidad + item.cantidad) } : i,
    );
  }
  return [...carrito, { ...item, color, cantidad: Math.max(1, Math.min(max, item.cantidad)) }];
}

/** Cambia la cantidad de una línea. Con 0 o menos, la elimina. */
export function cambiarCantidad(
  carrito: ItemCarrito[],
  referencia: string,
  color: string | null,
  cantidad: number,
): ItemCarrito[] {
  if (cantidad <= 0) return quitar(carrito, referencia, color);
  return carrito.map((i) => {
    if (!mismaLinea(i, referencia, color)) return i;
    const max = i.tipo === 'unica' ? 1 : MAX_CANTIDAD_MOSTACILLA;
    return { ...i, cantidad: Math.min(max, Math.floor(cantidad)) };
  });
}

export function quitar(carrito: ItemCarrito[], referencia: string, color: string | null): ItemCarrito[] {
  return carrito.filter((i) => !mismaLinea(i, referencia, color));
}

export const contarUnidades = (carrito: ItemCarrito[]) => carrito.reduce((s, i) => s + i.cantidad, 0);

/** Total de los productos con precio. Los de "precio a consultar" no suman. */
export const totalConocido = (carrito: ItemCarrito[]) =>
  carrito.reduce((s, i) => s + (i.precio ?? 0) * i.cantidad, 0);

export const hayPreciosPorConfirmar = (carrito: ItemCarrito[]) => carrito.some((i) => i.precio === null);

/**
 * Lee el carrito guardado. Si el JSON está dañado o fue editado a mano, descarta lo inválido
 * en vez de romper la página.
 */
export function deserializar(json: string | null): ItemCarrito[] {
  if (!json) return [];
  try {
    const datos: unknown = JSON.parse(json);
    if (!Array.isArray(datos)) return [];
    return datos.filter(
      (i): i is ItemCarrito =>
        typeof i === 'object' &&
        i !== null &&
        typeof i.referencia === 'string' &&
        typeof i.slug === 'string' &&
        /^[a-z0-9-]+$/.test(i.slug) &&
        typeof i.nombre === 'string' &&
        (i.tipo === 'unica' || i.tipo === 'mostacilla') &&
        (i.color === null || typeof i.color === 'string') &&
        Number.isInteger(i.cantidad) &&
        i.cantidad > 0 &&
        (i.precio === null || (typeof i.precio === 'number' && i.precio >= 0)),
    );
  } catch {
    return [];
  }
}
