// Creacion de una clase para errores HTTP
// La utilizo en todos los módulos para tener un estandar de respuesta.

export class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string
    ) {
        super(message)
        this.name = 'ApiError'
    }
}