import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { errorMiddleware } from './middlewares/error.middleware'

export const app = express()

// Middlewares globales
app.use(helmet())
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok' })
})

// Manejador de errores
app.use(errorMiddleware)