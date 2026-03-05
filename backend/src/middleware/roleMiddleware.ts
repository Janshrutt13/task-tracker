import type { Response, NextFunction } from "express";
import type { AuthRequest } from "../types/index.js";

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: "Forbidden" });
    }
}