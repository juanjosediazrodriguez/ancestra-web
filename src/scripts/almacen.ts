// Solo corre en el navegador. Guarda el carrito en localStorage y avisa a la página cuando cambia.
import { deserializar, contarUnidades, type ItemCarrito } from '../lib/carrito';

const CLAVE = 'ancestra:carrito';
export const EVENTO = 'ancestra:carrito-cambio';

export function leerCarrito(): ItemCarrito[] {
  try {
    return deserializar(localStorage.getItem(CLAVE));
  } catch {
    // localStorage puede estar bloqueado (navegación privada estricta)
    return [];
  }
}

export function guardarCarrito(carrito: ItemCarrito[]): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(carrito));
  } catch {
    /* sin almacenamiento, el carrito vive solo mientras la página esté abierta */
  }
  window.dispatchEvent(new CustomEvent(EVENTO, { detail: carrito }));
}

/** Actualiza el contador del encabezado. */
export function pintarContador(): void {
  const n = contarUnidades(leerCarrito());
  document.querySelectorAll<HTMLElement>('[data-contador-carrito]').forEach((el) => {
    el.textContent = String(n);
    el.hidden = n === 0;
  });
  document.querySelectorAll<HTMLElement>('[data-etiqueta-carrito]').forEach((el) => {
    el.setAttribute('aria-label', n === 0 ? 'Carrito vacío' : `Carrito: ${n} ${n === 1 ? 'producto' : 'productos'}`);
  });
}

// Mantiene el contador sincronizado, incluso entre pestañas.
window.addEventListener(EVENTO, pintarContador);
window.addEventListener('storage', (e) => {
  if (e.key === CLAVE) pintarContador();
});
