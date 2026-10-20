import { defineArrayMember, defineField, defineType } from 'sanity';

/**
 * El formulario que ven las dueñas. Los títulos y descripciones están escritos para ellas, no para desarrolladores.
 * Ojo: Sanity no impone este esquema en la base; si se cambia un `name`, hay que actualizar la consulta GROQ del sitio.
 */
export const mochila = defineType({
  name: 'mochila',
  title: 'Mochila',
  type: 'document',
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      description: 'Ej.: Mochila Sierra',
      validation: (r) => r.required().max(80),
    }),
    defineField({
      name: 'referencia',
      title: 'Referencia',
      type: 'string',
      description: 'Código único de esta mochila. Ej.: A012. Es lo que aparece en el pedido de WhatsApp.',
      validation: (r) =>
        r.required().regex(/^[A-Za-z0-9-]{2,20}$/, { name: 'referencia', invert: false }).error('Solo letras, números y guiones (2 a 20).'),
    }),
    defineField({
      name: 'slug',
      title: 'Dirección de la página',
      type: 'slug',
      description: 'Se genera con el botón a partir de la referencia. No hace falta tocarla.',
      options: { source: 'referencia', maxLength: 40 },
      // El carrito solo acepta minúsculas, números y guiones; así el link del pedido nunca se rompe.
      validation: (r) =>
        r.required().custom((slug) =>
          !slug?.current || /^[a-z0-9-]+$/.test(slug.current)
            ? true
            : 'Solo minúsculas, números y guiones. Usa el botón "Generate".',
        ),
    }),
    defineField({
      name: 'comunidad',
      title: 'Comunidad',
      type: 'string',
      options: {
        list: [
          { title: 'Wayuu', value: 'wayuu' },
          { title: 'Arhuaca', value: 'arhuaca' },
          { title: 'Kankuama', value: 'kankuama' },
        ],
        layout: 'radio',
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'tipo',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Pieza única (solo hay una)', value: 'unica' },
          { title: 'Mostacilla (modelo que se repite)', value: 'mostacilla' },
        ],
        layout: 'radio',
      },
      initialValue: 'unica',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'colores',
      title: 'Colores disponibles',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      options: { layout: 'tags' },
      description: 'Escribe cada color y presiona Enter.',
      hidden: ({ document }) => document?.tipo !== 'mostacilla',
      validation: (r) =>
        r.custom((colores, ctx) =>
          ctx.document?.tipo === 'mostacilla' && (!colores || colores.length === 0)
            ? 'Una mochila de mostacilla necesita al menos un color.'
            : true,
        ),
    }),
    defineField({
      name: 'precio',
      title: 'Precio (COP)',
      type: 'number',
      description: 'Sin puntos ni signo $. Si se deja vacío, la página dice "Precio a consultar".',
      validation: (r) => r.min(0).integer(),
    }),
    defineField({
      name: 'fotos',
      title: 'Fotos',
      type: 'array',
      description: 'La primera es la que sale en el catálogo. En piezas únicas, fotos de esa misma mochila.',
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({
              name: 'alt',
              title: 'Descripción de la foto',
              type: 'string',
              description: 'Para personas que usan lector de pantalla. Ej.: Mochila arhuaca crema con rombos café.',
              validation: (r) => r.required().max(140),
            }),
          ],
        }),
      ],
      validation: (r) => r.required().min(1).max(8),
    }),
    defineField({
      name: 'descripcion',
      title: 'Descripción',
      type: 'text',
      rows: 4,
      validation: (r) => r.max(600),
    }),
    defineField({
      name: 'medidas',
      title: 'Medidas',
      type: 'string',
      description: 'Ej.: 30 × 25 cm',
    }),
    defineField({
      name: 'disponible',
      title: 'Disponible',
      type: 'boolean',
      description: 'Apágalo cuando se venda (pieza única) o se agote (mostacilla). La mochila sigue visible como "Vendida".',
      initialValue: true,
    }),
  ],
  orderings: [
    { title: 'Más recientes', name: 'recientes', by: [{ field: '_createdAt', direction: 'desc' }] },
  ],
  preview: {
    select: { title: 'nombre', referencia: 'referencia', disponible: 'disponible', media: 'fotos.0' },
    prepare: ({ title, referencia, disponible, media }) => ({
      title,
      subtitle: `${referencia ?? 'sin referencia'}${disponible === false ? ' · VENDIDA' : ''}`,
      media,
    }),
  },
});
