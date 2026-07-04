// Middleware de autenticación
import { Request, Response, NextFunction } from "express";  
import { verifyToken } from "../utils/jwt";
import { ApiError } from "../utils/ApiError";

export function authMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const authHeader = req.headers.authorization 

    if (!authHeader?.startsWith('Bearer ')) {
        throw new ApiError(401, 'Token no proporcionado.')
    }

    const token = authHeader.split(' ')[1]

    try {
        req.user = verifyToken(token)
        next()
    } catch {
        throw new ApiError(401, 'Token inválido o expirado')
    }
}