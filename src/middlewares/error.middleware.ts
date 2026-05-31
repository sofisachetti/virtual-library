// Middleware para el manejo de errores

import { Request, Response, NextFunction } from 'express'
import { ApiError } from '../utils/ApiError'
import { logger } from '../config/logger'

export function errorMiddleware(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (err instanceof ApiError) {
        res.status(err.statusCode).json({ message: err.message })
        return
    }

    logger.error(`Unhandled error: ${err.message}`)
    res.status(500).json({ message: 'Internal server error' })
}