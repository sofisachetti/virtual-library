import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorMiddleware } from './middlewares/error.middleware'
import { authRouter } from './modules/auth/auth.routes'
import { bookRouter } from './modules/books/book.routes'

export const app = express()

// Middlewares globales
app.use(helmet())
app.use(cors())
app.use(express.json())

// Rutas
app.use('/api/auth', authRouter)
app.use('/api/books', bookRouter)

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Manejador de errores
app.use(errorMiddleware)