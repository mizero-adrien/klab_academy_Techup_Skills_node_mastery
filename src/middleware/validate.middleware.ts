import { Request, Response, NextFunction } from 'express';
import { ZodType } from 'zod';

export const validateBody = (schema: ZodType) =>(req: Request, res: Response, next: NextFunction)=>{
    const result = schema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            message: "Validation Failed",
            errors: result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message,
            })),
        })
    };
    req.body  = result.data;
    next();
}

