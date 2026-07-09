// construcción de shema para validaciones de registro y login
import { z } from 'zod'

// -------- SCHEMA PARA EL REGISTRO ---------
// Todo lo que venag en req.body y al hacer POST /register debe tener esa forma para pasar la validacion
export const registerSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 carcteres'),   // El campo debe ser string de al menos 2 carcteres
    email: z.string().check(z.email('Email inválido')), // string que pase la validación de formato email
    password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres'),  //String de al menso 8 caracteres, acá solo se valida longitud, bcrypt hace el hasheo
})

// --------- SCHEMA PARA EL LOGIN ---------
// En este caso el password solo requiere 1, no se valida longitud minima para no das pistas sobre el modelo de contraseña
export const loginSchema = z.object({
    email: z.string().check(z.email('Email inválido')),
    password: z.string().min(1, 'La contraseña es requerida')
})

// z.infer genera automaticamente un tipo a partir del schema.
// Ventaja -> si se modifica el schema, el tipo se modifica automaicamente
export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>