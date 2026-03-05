import { z } from 'zod';
import type { Request, Response, NextFunction } from 'express';

export const taskSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters long"),
    description: z.string().optional(),
    status: z.enum(["pending", "completed"]).optional(),
});

export const validateTask = (req: Request, res: Response, next: NextFunction) => {
    try {
        taskSchema.parse(req.body);
        next();
    } catch (error: any) {
        return res.status(400).json({ errors: error.errors.map((e: any) => e.message) });
    }
};