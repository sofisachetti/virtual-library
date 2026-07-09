import { Request, Response, NextFunction } from 'express'
import { 
    createBook,  
    getBooks,
    getBookById,
    updateBook,
    deleteBook
} from './book.service'
import { CreateBookInput, UpdateBookInput } from './book.schema'
import { Format } from '../../generated/prisma'


export async function create(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // req.user! -> indica que confiamos que el usuario existe
        // esta va a ser una ruta que siempre pasa por authMiddleware antes de llegar a este punto
        const book = await createBook(req.user!.id, req.body as CreateBookInput)
        res.status(201).json(book)
    } catch (err) {
        next(err)
    }
}


export async function list(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // los filtros para listar van a vernir como query params
        const { format, genre, language, search } = req.query

        const books = await getBooks(req.user!.id, {
            format: format as Format | undefined,
            genre: genre as string | undefined,
            language: language as string | undefined,
            search: search as string | undefined,
        })
        res.json(books)
    } catch (err) {
        next(err)
    }
}

