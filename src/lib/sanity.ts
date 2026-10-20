import { createClient } from '@sanity/client';
import { createImageUrlBuilder, type SanityImageSource } from '@sanity/image-url';
import { COMUNIDADES, type Comunidad, type Foto, type Mochila } from './tipos';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET || 'production';

export const sanityConfigurado = Boolean(projectId);

/**
 * Cliente de solo lectura. El dataset es público, así que no hace falta token.
 * `published` excluye los borradores que las dueñas todavía no han publicado.
 */
const cliente = sanityConfigurado
  ? createClient({ projectId, dataset, apiVersion: '2026-10-01', useCdn: false, perspective: 'published' })
  : null;

const imagenes = cliente ? createImageUrlBuilder(cliente) : null;

const CONSULTA = /* groq */ `
*[_type == "mochila" && defined(slug.current)] | order(coalesce(disponible, true) desc, _createdAt desc) {
  referencia,
  "slug": slug.current,
  nombre,
  comunidad,
  tipo,
  "colores": coalesce(colores, []),
  precio,
  "descripcion": coalesce(descripcion, ""),
  medidas,
  "disponible": coalesce(disponible, true),
  "fotos": coalesce(fotos[defined(asset)]{
    asset, crop, hotspot,
    "alt": coalesce(alt, ""),
    "ancho": asset->metadata.dimensions.width,
    "alto": asset->metadata.dimensions.height
  }, [])
}`;

interface FotoCruda {
  asset: SanityImageSource;
  crop?: unknown;
  hotspot?: unknown;
  alt: string;
  ancho: number;
  alto: number;
}

interface MochilaCruda extends Omit<Mochila, 'fotos' | 'comunidad'> {
  comunidad: string;
  fotos: FotoCruda[];
}

function aFoto(f: FotoCruda, nombre: string): Foto {
  const imagen = () => imagenes!.image(f as SanityImageSource);
  const base = imagen().auto('format').fit('max');
  return {
    url: base.width(1200).url(),
    miniatura: base.width(600).url(),
    // JPG fijo (no auto): el lector de vistas previas de WhatsApp no siempre acepta WebP/AVIF.
    // fit('crop') respeta el punto de interés (hotspot) que marquen en el Studio.
    social: imagen().width(1200).height(630).fit('crop').format('jpg').quality(80).url(),
    alt: f.alt || nombre,
    ancho: f.ancho,
    alto: f.alto,
  };
}

/** Trae todas las mochilas publicadas. Se ejecuta al construir el sitio, no en cada visita. */
export async function mochilasDeSanity(): Promise<Mochila[]> {
  if (!cliente) return [];
  const crudas = await cliente.fetch<MochilaCruda[]>(CONSULTA);

  return crudas.flatMap((m) => {
    // El esquema lo impone el Studio, no la base: se descarta lo que no cumpla en vez de romper el build.
    if (!m.referencia || !m.nombre || !COMUNIDADES.includes(m.comunidad as Comunidad)) {
      console.warn(`[sanity] Mochila omitida por datos incompletos: ${m.slug}`);
      return [];
    }
    if (m.tipo !== 'unica' && m.tipo !== 'mostacilla') {
      console.warn(`[sanity] Mochila omitida por tipo inválido: ${m.slug}`);
      return [];
    }
    return [{
      ...m,
      comunidad: m.comunidad as Comunidad,
      colores: m.tipo === 'mostacilla' ? m.colores : [],
      precio: typeof m.precio === 'number' ? m.precio : null,
      fotos: m.fotos.map((f) => aFoto(f, m.nombre)),
    }];
  });
}
