import { z } from 'zod'

// Realizamos un enum del formato, los libros están principalmente en físico o digital
export const formatEnum = z.enum(['PHYSICAL', 'DIGITAL'])

export const createBookSchema = z.object({
    // Son los tres campos principales que deben ser si o si obligatorios
    title: z.string().min(1, 'El título es requerido'),
    author: z.string().min(1, 'El autor es requerido'),
    format: formatEnum,

    // Campos que pueden ser opcionales
    genre: z.string().optional(),
    year: z.number().int().min(1000).max(new Date().getFullYear()).optional(),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    languaje: z.string().optional(),
    pages: z.number().int().positive().optional(),
    coverUrl: z.string().optional(),
    seriesName: z.string().optional(),
    seriesOrder: z.number().int().positive().optional(),

    // array de strings para las etiquetas
    tags: z.array(z.string()).optional(),
})

// Si queremos hacer una actualización de un libros, vamos autilizar el mismo schema
// por eso el uso de .partial(), que va a convertir cada campo en opcionl automaticamente
// Si el clienta manda un PATCH, solo se vana modificar algunos campos, no todos
export const updateBookSchema = createBookSchema.partial()

// exportamos el bookSchema pata crear y para update como tipos
export type CreateBookInput = z.infer<typeof createBookSchema>
export type UpdateBookInput = z.infer<typeof updateBookSchema>