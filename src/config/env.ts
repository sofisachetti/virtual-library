// Validación de las variables de entorno con un Schema de Zod. 
// Si falta alguna variable el servidor no inicia y envia mensaje de error.
// Se ahorran errores a futuro durante las pruebas por si falta alguna variable.

import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
    PORT: z.string().default('3000'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string(),
    JWT_SECRET: z.string().min(10),
    JWT_EXPIRES_IN: z.string().default('7d')
})

// Procesamos el .env con el schema y lo guardamso en una variable
const parsed = envSchema.safeParse(process.env)

// Condicional -> si el schema de zod no se cumple arroja error
if (!parsed.success) {
    console.error('Variables de entorno inválidas: ')
    console.error(parsed.error)
    process.exit(1)
}

export const env = parsed.data