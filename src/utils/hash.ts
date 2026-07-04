// Funciones para hasheo
import bcrypt from "bcryptjs";

// Hash del password ingresado
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10)
}

// Verificacion del password guardado y el hash
export async function comparePassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash)
}