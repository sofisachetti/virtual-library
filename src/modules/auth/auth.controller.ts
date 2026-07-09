import { Request, Response, NextFunction } from 'express'
import { registerUser, loginUser } from './auth.service'
import { RegisterInput, LoginInput } from './auth.schema'

export async function register(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await registerUser(req.body as RegisterInput)
        res.status(201).json(result)
    } catch (err) {
        next(err)  // se saltan todos los middlewares y va derecho al error middleware
    }
}

export async function login(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const result = await loginUser(req.body as LoginInput)
        res.json(result)
    } catch (err) {
        next(err)
    }
}