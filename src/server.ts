import { app } from './app'
import { env } from './config/env'
import { prisma } from './config/db'
import { logger } from './config/logger'

async function main() {
    await prisma.$connect()
    logger.info('Conectado a la Base de Datos')

    app.listen(env.PORT, () => {
        logger.info(`Servidor corriendo en http://localhost:${env.PORT}`)
    })
}

main().catch((err) => {
    logger.error(`Error al inciar el servidor: ${err.message}`)
    process.exit(1)
})