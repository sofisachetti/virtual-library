import { Router } from "express";
import { register, login  } from './auth.controller';
import { validate } from '../../middlewares/validate.middleware'
import { registerSchema, loginSchema } from "./auth.schema";

export const authRouter = Router()

authRouter.post('/register', validate(registerSchema), register)
authRouter.post('/login', validate(loginSchema), login)