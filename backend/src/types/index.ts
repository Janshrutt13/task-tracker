export interface JWTPayload {
    id: number;
    role: string;
}

// Extend Express Request to include our user
import type { Request } from 'express';
export interface AuthRequest extends Request {
    user?: JWTPayload;
}