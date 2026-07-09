import { prisma } from "../../config/db";
import { hashPassword, comparePassword } from "../../utils/hash";
import { signToken } from "../../utils/jwt";
import { ApiError } from "../../utils/ApiError";
import { RegisterInput, LoginInput } from "./auth.schema";


// -------- FUNCIÓN DE REGISTRO ----------
export async function registerUser(input: RegisterInput) {
    // Verificamos que el usuario que se quier registrar no tenga cuenta
    const existing = await prisma.user.findUnique({
        where: { email: input.email },
    })

    if (existing) {
        throw new ApiError(409, 'Ya existe una cuenta con ese email')
    }

    // hasheo de la contraseña ingresada
    const passwordHash = await hashPassword(input.password)

    // creación de usuario
    const user = await prisma.user.create({
        data: {
            name: input.name,
            email: input.email,
            passwordHash,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
        },
    })

    // se le asigna un token
    const token = signToken({ id: user.id, role: user.role })

    return { user, token }
}


// ---------- FUNCIÓN DE LOGIN -----------
export async function loginUser(input:LoginInput) {
    const user = await prisma.user.findUnique({
        where: { email: input.email }
    })

    if (!user || !user.isActive) {
        throw new ApiError(401, 'Credeniales inválidas')
    }

    const validPassword = await comparePassword(input.password, user.passwordHash)

    if (!validPassword) {
        throw new ApiError(401, 'Credenciales inválidas')
    }

    const token = signToken({ id: user.id, role: user.role })

    return {
        user: {
            id: user.id,
            name: user.name,
            emial: user.email,
            role: user.role,
        },
        token,
    }
}

