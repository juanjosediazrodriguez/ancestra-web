import { hayPreciosPorConfirmar, totalConocido, type ItemCarrito } from './carrito';

const cop = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

export const formatearPrecio = (valor: number | null) => (valor === null ? 'Precio a consultar' : cop.format(valor));

export interface DatosCliente {
  nombre: string;
  ciudad: string;
}

/** Solo dígitos, entre 10 y 15 (formato internacional sin "+"). */
export const numeroValido = (numero: string) => /^\d{10,15}$/.test(numero);

/** Línea de total del pedido, que también usa el carrito. */
export function textoTotal(items: ItemCarrito[]): string {
  const conPrecio = items.some((i) => i.precio !== null);
  if (!hayPreciosPorConfirmar(items)) return `Total productos: ${cop.format(totalConocido(items))} + envío`;
  if (!conPrecio) return 'Precios por confirmar + envío';
  return `Total de lo que tiene precio: ${cop.format(totalConocido(items))} (hay precios por confirmar) + envío`;
}

/** Arma el texto del pedido que llega al WhatsApp de Ancestra. */
export function mensajePedido(items: ItemCarrito[], cliente: DatosCliente): string {
  const lineas = items.map((i) => {
    const color = i.color ? ` – color ${i.color}` : '';
    const precio = i.precio === null ? 'precio a consultar' : cop.format(i.precio * i.cantidad);
    return `• ${i.nombre} (ref. ${i.referencia})${color} x${i.cantidad}: ${precio}`;
  });

  return [
    `Hola Ancestra, soy ${cliente.nombre.trim()} (${cliente.ciudad.trim()}) y quiero hacer este pedido:`,
    ...lineas,
    textoTotal(items),
  ].join('\n');
}

/**
 * Link que abre el chat con el mensaje ya escrito.
 * encodeURIComponent evita que tildes, saltos de línea, "&" o "#" rompan la URL.
 */
export function linkPedido(numero: string, items: ItemCarrito[], cliente: DatosCliente): string {
  if (!numeroValido(numero)) throw new Error('Número de WhatsApp inválido: deben ser 10 a 15 dígitos, sin "+".');
  if (items.length === 0) throw new Error('El carrito está vacío.');
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensajePedido(items, cliente))}`;
}

/** Link para preguntar por una mochila vendida o agotada. */
export function linkConsulta(numero: string, nombre: string, referencia: string): string {
  const texto = `Hola Ancestra, vi la mochila ${nombre} (ref. ${referencia}) y quisiera saber si tienen una similar.`;
  return `https://wa.me/${numero}?text=${encodeURIComponent(texto)}`;
}
