import { describe, expect, it } from 'vitest';
import type { ItemCarrito } from '../src/lib/carrito';
import { linkConsulta, linkPedido, mensajePedido, numeroValido } from '../src/lib/whatsapp';

const NUMERO = '573001234567';
const items: ItemCarrito[] = [
  { referencia: 'A001', nombre: 'Sierra', tipo: 'unica', color: null, cantidad: 1, precio: 200000 },
  { referencia: 'M001', nombre: 'Sol & Luna', tipo: 'mostacilla', color: 'Dorado', cantidad: 2, precio: 90000 },
];
const cliente = { nombre: '  Ana María ', ciudad: 'Medellín' };

/** Quita los espacios raros que pone Intl (no separables) para comparar texto. */
const normalizar = (s: string) => s.replace(/\s/g, ' ');

describe('mensajePedido', () => {
  it('incluye cliente, cada línea con referencia y el total', () => {
    const m = normalizar(mensajePedido(items, cliente));
    expect(m).toContain('soy Ana María (Medellín)');
    expect(m).toContain('• Sierra (ref. A001) x1');
    expect(m).toContain('• Sol & Luna (ref. M001) – color Dorado x2');
    expect(m).toMatch(/Total productos: \$ ?380\.000 \+ envío/);
  });

  it('avisa cuando hay precios por confirmar', () => {
    const m = normalizar(mensajePedido([items[0], { ...items[1], precio: null }], cliente));
    expect(m).toContain('precio a consultar');
    expect(m).toMatch(/Total de lo que tiene precio: \$ ?200\.000 \(hay precios por confirmar\)/);
  });

  it('si nada tiene precio no muestra "$ 0"', () => {
    const m = mensajePedido(items.map((i) => ({ ...i, precio: null })), cliente);
    expect(m).toContain('Precios por confirmar + envío');
    expect(m).not.toMatch(/\$\s?0\b/);
  });
});

describe('linkPedido', () => {
  it('codifica el mensaje para que "&", tildes y saltos de línea no rompan la URL', () => {
    const url = new URL(linkPedido(NUMERO, items, cliente));
    expect(url.origin + url.pathname).toBe(`https://wa.me/${NUMERO}`);
    expect([...url.searchParams.keys()]).toEqual(['text']); // el "&" de "Sol & Luna" no creó otro parámetro
    expect(url.searchParams.get('text')).toBe(mensajePedido(items, cliente));
  });

  it('rechaza un número mal escrito o un carrito vacío', () => {
    expect(() => linkPedido('+57 300 123 4567', items, cliente)).toThrow();
    expect(() => linkPedido(NUMERO, [], cliente)).toThrow();
  });
});

describe('numeroValido y linkConsulta', () => {
  it('acepta solo dígitos, 10 a 15', () => {
    expect(numeroValido(NUMERO)).toBe(true);
    expect(numeroValido('')).toBe(false);
    expect(numeroValido('+573001234567')).toBe(false);
  });

  it('el link de consulta menciona la referencia', () => {
    const texto = new URL(linkConsulta(NUMERO, 'Guajira', 'W001')).searchParams.get('text');
    expect(texto).toContain('ref. W001');
  });
});
