import { Router } from "express";
import { 
    create,
    list,
    getOne,
    update,
    remove,
    addBook,
    removeBook
} from './collection.controller'
import { authMiddleware } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import {
    createCollectionSchema,
    updateCollectionSchema,
    addBookSchema
} from './collection.schema'

export const collectionRouter = Router()

// middleware de uso global que se aplica a todas las rutas para validacion
collectionRouter.use(authMiddleware)

// rutas base
collectionRouter.get('/', list)
collectionRouter.post('/', validate(createCollectionSchema), create)
collectionRouter.get('/:id', validate(updateCollectionSchema), update)
collectionRouter.delete('/:id', remove)

// rutas anidadas para la gestion de libros dentro de una coleccion

// POST -> /collections/:id/books (para agregar libro)
collectionRouter.post('/:id/books', validate(addBookSchema), addBook)

// DELETE -> /collections/:id/books/:bookId (para sacar libro)
collectionRouter.delete('/:id/books/:bookId', removeBook)