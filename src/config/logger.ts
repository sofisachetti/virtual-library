// Uso de Winston para mantener un control de los logs que surgen 

import winston from 'winston'
import { env } from './env'

export const logger = winston.createLogger({
    level: env.NODE_ENV === 'production' ? 'warn' : 'debug',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level}: ${message}`
        })
    ),
    transports: [new winston.transports.Console()]
})