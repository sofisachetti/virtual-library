import { Request, Response, NextFunction } from "express"
import {
    createCollection,
    getCollections,
    getCollectionById,
    updateCollection,
    deleteCollection,
    addBookToCollection,
    removeBookFromCollection,
} from './collection.service'
import { CreateCollectionInput, UpdateCollectionInput, AddBookInput } from "./collection.schema"


// CREAR -------------------------------------------------------------
export async function create(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const collection = await createCollection(
            req.user!.id,
            req.body as CreateCollectionInput
        )
        res.status(201).json(collection)
    } catch (err) {
        next(err)
    }
}


// LISTAR ------------------------------------------------------------
export async function list(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const collections = await getCollections(req.user!.id)
        res.json(collections)
    } catch (err) {
        next(err)
    }
}


// BUSCAR ------------------------------------------------------------
export async function getOne(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const collectionId = parseInt(req.params.id as string)

        if (isNaN(collectionId)) {
            res.status(400).json({ message: 'ID inválido' })
            return
        }

        const collection = await getCollectionById(req.user!.id, collectionId)
        res.json(collection)
    } catch (err) {
        next(err)
    }
}


// EDITAR -------------------------------------------------------------
export async function update(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const collectionId = parseInt(req.params.id as string)

        if (isNaN(collectionId)) {
            res.status(400).json({ message: 'ID inválido' })
            return
        }

        const collection = await updateCollection(
            req.user!.id,
            collectionId,
            req.body as UpdateCollectionInput
        )
        res.json(collection)
    } catch (err) {
        next(err)
    }
}


// ELIMINAR ----------------------------------------------------------
export async function remove(
    req: Request,
    res: Response,
    next: NextFunction
): Promise <void> {
    try {
        const collectionId = parseInt(req.params.id as string)

        if (isNaN(collectionId)) {
            res.status(400).json({ message: 'ID inválido' })
            return
        }

        await deleteCollection(req.user!.id, collectionId)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}


// AGREGAR LIBRO -----------------------------------------------------
export async function addBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise <void> {
    try {
        const collectionId = parseInt(req.params.id as string)

        if (isNaN(collectionId)) {
            res.status(400).json({ message: 'ID inválido' })
            return
        }

        const result = await addBookToCollection(
            req.user!.id,
            collectionId,
            req.body as AddBookInput
        )
        res.status(201).json(result)
    } catch (err) {
        next(err)
    }
}


// ELIMINAR LIBRO ----------------------------------------------------
export async function removeBook(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const collectionId = parseInt(req.params.id as string)
        // el bookId tiene que venir como param dentro de la URL:  /collections/:id/books/:bookId
        const bookId = parseInt(req.params.bookId as string)

        if (isNaN(collectionId) || isNaN(bookId)) {
            res.status(400).json({ message: 'ID inválido' })
            return
        }

        await removeBookFromCollection(req.user!.id, collectionId, bookId)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}