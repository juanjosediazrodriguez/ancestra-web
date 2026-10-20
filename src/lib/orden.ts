export type Criterio = 'recientes' | 'precio-asc' | 'precio-desc';

export const CRITERIOS: { valor: Criterio; texto: string }[] = [
  { valor: 'recientes', texto: 'Más recientes' },
  { valor: 'precio-asc', texto: 'Precio: menor a mayor' },
  { valor: 'precio-desc', texto: 'Precio: mayor a menor' },
];

interface Ordenable {
  /** Posición original (0 = la más reciente). */
  indice: number;
  precio: number | null;
}

/**
 * Ordena sin modificar el arreglo original. Las mochilas sin precio ("a consultar")
 * van siempre al final, y a igual precio se respeta el orden de llegada.
 */
export function ordenar<T extends Ordenable>(items: T[], criterio: Criterio): T[] {
  const copia = [...items];
  if (criterio === 'recientes') return copia.sort((a, b) => a.indice - b.indice);
  const signo = criterio === 'precio-asc' ? 1 : -1;
  return copia.sort((a, b) => {
    if (a.precio === null && b.precio === null) return a.indice - b.indice;
    if (a.precio === null) return 1;
    if (b.precio === null) return -1;
    return (a.precio - b.precio) * signo || a.indice - b.indice;
  });
}

export const criterioValido = (v: unknown): v is Criterio => CRITERIOS.some((c) => c.valor === v);
