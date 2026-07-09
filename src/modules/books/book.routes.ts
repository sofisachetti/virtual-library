import { Router } from 'express'
import { create, list, getOne, update, remove } from './book.controller'
import { authMiddleware } from '../../middlewares/auth.middleware'
import { validate } from '../../middlewares/validate.middleware'
import { createBookSchema, updateBookSchema } from './book.schema'

export const bookRouter = Router()

// se aplica el authMiddleware a todas las rutas del router de una sola vez
// ahorra el tener que ponerlo en cada ruta de forma individual
bookRouter.use(authMiddleware)

bookRouter.get('/', list)
bookRouter.post('/', validate(createBookSchema), create)
bookRouter.get('/:id', getOne)
bookRouter.patch('/:id', validate(updateBookSchema), update)
bookRouter.delete('/:id', remove)