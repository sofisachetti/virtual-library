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
