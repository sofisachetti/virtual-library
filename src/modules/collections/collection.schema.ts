import { z } from 'zod'

export const createCollectionSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    description: z.string().optional(),
})

// Lo mismo que con books, para la actualizacion los campos van a ser opcionales
export const updateCollectionSchema = createCollectionSchema.partial()

// schema para agregar/quitar un libro de una coleccion
// solo requiere el ID del libro en el body
export const addBookSchema = z.object({
    bookId: z.number().int().positive('El ID del libro debe ser un número positivo')
})

export type CreateCollectionInput = z.infer<typeof createCollectionSchema>
export type UpdateCollectionInput = z.infer<typeof updateCollectionSchema>
export type AddBookInput = z.infer<typeof addBookSchema>