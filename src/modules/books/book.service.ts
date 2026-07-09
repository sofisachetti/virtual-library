import { prisma } from "../../config/db";
import { Prisma } from "../../generated/prisma"
import { ApiError } from "../../utils/ApiError";
import { CreateBookInput, UpdateBookInput } from "./book.schema";


// CREAR UN LIBRO ----------------------------------
export async function createBook(userId: number, input: CreateBookInput) {
    // se construye un objeto data con el tipo esperado por prisma
    const data: Prisma.BookUncheckedCreateInput = {
        ...input,
        userId,
    }

    const book = await prisma.book.create({ data })

    return book
}

// LISTAR LOS LIBROS -------------------------------
export async function getbooks(
    userId: number,
    filters: {
        format?: 'PHYSICAL' | 'DIGITAL'
        genre?: string
        language?: string
        search?: string     // busca por titulo o autor
        }
    ) {
        const books = await prisma.book.findMany({
            where: {
                userId,   // cada usuario va a ver sus propios libros

                // solo se aplica el filtro si el valor fue enviado
                // si es undefined, prisma lo va a ignorar
                format: filters.format,
                genre: filters.genre,
                language: filters.language,

                // busqueda por titulo o autor - case insensitive
                ...(filters.search && {
                    OR: [
                        { title: { contains: filters.search } },
                        { author: { contains: filters.search } },
                    ],
                }),
            },
            orderBy: { createdAt: 'desc' }, // muestra los mas recientes primero
        })
        return books
}

