import { describe, expect, it } from 'vitest';
import {
  agregar, cambiarCantidad, contarUnidades, deserializar, hayPreciosPorConfirmar, quitar, totalConocido,
  MAX_CANTIDAD_MOSTACILLA, type ItemCarrito,
} from '../src/lib/carrito';

const unica: ItemCarrito = { referencia: 'A001', slug: 'a001', nombre: 'Sierra', tipo: 'unica', color: null, cantidad: 1, precio: 200000 };
const mostacilla = (color: string, cantidad = 1): ItemCarrito => ({
  referencia: 'M001', slug: 'm001', nombre: 'Sol', tipo: 'mostacilla', color, cantidad, precio: 90000,
});

describe('agregar', () => {
  it('una pieza única nunca pasa de 1, aunque se agregue dos veces', () => {
    const c = agregar(agregar([], unica), unica);
    expect(c).toHaveLength(1);
    expect(c[0].cantidad).toBe(1);
  });

  it('ignora el color en una pieza única', () => {
    expect(agregar([], { ...unica, color: 'Rojo' })[0].color).toBeNull();
  });

  it('suma cantidades de la misma mostacilla y el mismo color', () => {
    const c = agregar(agregar([], mostacilla('Dorado', 2)), mostacilla('Dorado', 3));
    expect(c).toHaveLength(1);
    expect(c[0].cantidad).toBe(5);
  });

  it('separa la misma mostacilla en colores distintos', () => {
    expect(agregar(agregar([], mostacilla('Dorado')), mostacilla('Rojo'))).toHaveLength(2);
  });

  it('limita la mostacilla al máximo', () => {
    expect(agregar([], mostacilla('Dorado', 99))[0].cantidad).toBe(MAX_CANTIDAD_MOSTACILLA);
  });

  it('no modifica el carrito original', () => {
    const original = [mostacilla('Dorado')];
    agregar(original, mostacilla('Dorado'));
    expect(original[0].cantidad).toBe(1);
  });
});

describe('cambiarCantidad y quitar', () => {
  it('con 0 elimina la línea', () => {
    expect(cambiarCantidad([mostacilla('Dorado', 3)], 'M001', 'Dorado', 0)).toEqual([]);
  });

  it('no deja subir una pieza única a 2', () => {
    expect(cambiarCantidad([unica], 'A001', null, 2)[0].cantidad).toBe(1);
  });

  it('quitar solo saca el color indicado', () => {
    const c = quitar([mostacilla('Dorado'), mostacilla('Rojo')], 'M001', 'Dorado');
    expect(c.map((i) => i.color)).toEqual(['Rojo']);
  });
});

describe('totales', () => {
  it('cuenta unidades y suma lo que tiene precio', () => {
    const c = [unica, mostacilla('Dorado', 2)];
    expect(contarUnidades(c)).toBe(3);
    expect(totalConocido(c)).toBe(200000 + 2 * 90000);
    expect(hayPreciosPorConfirmar(c)).toBe(false);
  });

  it('los productos sin precio no suman y se marcan', () => {
    const c = [unica, { ...mostacilla('Dorado'), precio: null }];
    expect(totalConocido(c)).toBe(200000);
    expect(hayPreciosPorConfirmar(c)).toBe(true);
  });
});

describe('deserializar', () => {
  it('devuelve vacío con null, JSON inválido o algo que no es arreglo', () => {
    expect(deserializar(null)).toEqual([]);
    expect(deserializar('{no es json')).toEqual([]);
    expect(deserializar('{"a":1}')).toEqual([]);
  });

  it('descarta las líneas manipuladas y conserva las válidas', () => {
    const json = JSON.stringify([unica, { ...unica, referencia: 'X', cantidad: -3 }, { nombre: 'sin ref' }]);
    expect(deserializar(json)).toEqual([unica]);
  });

  it('descarta carritos viejos sin slug y slugs que podrían inyectar algo en la URL', () => {
    const { slug: _, ...sinSlug } = unica;
    const json = JSON.stringify([sinSlug, { ...unica, slug: '../admin?x=1' }, { ...unica, slug: 'A001' }]);
    expect(deserializar(json)).toEqual([]);
  });
});
