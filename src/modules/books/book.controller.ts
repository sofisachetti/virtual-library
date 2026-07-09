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


export async function getOne(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // en este caso las params van a venir en la URL como string, por lo cual hay que convertirlos
        const bookId = parseInt(req.params.id as string)

        if (isNaN(bookId)) {
            res.status(400).json({ message: 'ID inválido'})
            return
        }

        const book = await getBookById(req.user!.id, bookId)
        res.json(book)
    } catch (err) {
        next(err)
    }
}


export async function update(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const bookId = parseInt(req.params.id as string)

        if (isNaN(bookId)) {
            res.status(400).json({ message: 'ID inválido'})
            return
        }

        const book = await updateBook(
            req.user!.id,
            bookId,
            req.body as UpdateBookInput
        )
        res.json(book)
    } catch (err) {
        next(err)
    }
}


export async function remove(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const bookId = parseInt(req.params.id as string)

        if (isNaN(bookId)) {
            res.status(400).json({ message: 'ID inválido'})
            return
        }

        await deleteBook(req.user!.id, bookId)

        // codigo 201 en la rta -> es el estandar para op delete exitosas
        // 201 No Content -> exito pero sin cuerpo
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}


