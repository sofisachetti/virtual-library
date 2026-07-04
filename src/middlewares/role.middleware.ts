// Middleware para verificacion de rol
import { Request, Response, NextFunction } from "express";
import { Role } from "../generated/prisma";
import { ApiError } from "../utils/ApiError";

// Si no hay req.user o no incluye el rol especificado, retorna error
export function requireRole(...roles: Role[]){
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            throw new ApiError(403, 'No tenés permisos para realizar esta acción')
        }
        next()
    }
}