import { describe, expect, it } from 'vitest';
import { criterioValido, ordenar } from '../src/lib/orden';

const items = [
  { indice: 0, precio: 150000, n: 'a' },
  { indice: 1, precio: null, n: 'b' },
  { indice: 2, precio: 90000, n: 'c' },
  { indice: 3, precio: 150000, n: 'd' },
  { indice: 4, precio: null, n: 'e' },
];
const nombres = (xs: typeof items) => xs.map((x) => x.n).join('');

describe('ordenar', () => {
  it('recientes respeta el orden original', () => {
    expect(nombres(ordenar([...items].reverse(), 'recientes'))).toBe('abcde');
  });

  it('precio de menor a mayor, empates por llegada y los "a consultar" al final', () => {
    expect(nombres(ordenar(items, 'precio-asc'))).toBe('cadbe');
  });

  it('precio de mayor a menor también deja los "a consultar" al final', () => {
    expect(nombres(ordenar(items, 'precio-desc'))).toBe('adcbe');
  });

  it('no modifica el arreglo original', () => {
    const copia = [...items];
    ordenar(items, 'precio-asc');
    expect(items).toEqual(copia);
  });

  it('valida el criterio que viene de la URL', () => {
    expect(criterioValido('precio-asc')).toBe(true);
    expect(criterioValido('<script>')).toBe(false);
  });
});
