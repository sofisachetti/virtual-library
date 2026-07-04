// Configuración de JWT
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { Role } from '../generated/prisma'

// forma del objeto que se va a guardar en JWT
interface TokenPayload {
    id: number
    role: Role
}

// Va arecibir el objeto payload del tipo TokenPayload y devuelve un string de JWT generado
export function signToken(payload: TokenPayload): string {
    return jwt.sign(payload, env.JWT_SECRET, {
        expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions)
}

// Recibe el token del header Authorization, lo verifica y verifica tambien la clave del env
export function verifyToken(token: string): TokenPayload {
    return jwt.verify(token, env.JWT_SECRET) as TokenPayload
}