import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { ApiError } from "../utils/ApiError";

export function validate(schema: z.ZodTypeAny) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body)

        if (!result.success) {
            const message = result.error.issues
                .map((e) => `${e.path.join('.')}: ${e.message}`)
                .join(', ')
            throw new ApiError(400, message)
        }

        req.body = result.data
        next()
    }
}