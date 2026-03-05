import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { type JWTPayload } from '../types/index.js';

export const hashedPassword = async (password: string): Promise<string> => {
    return await bcrypt.hash(password, 10);
}

export const generateToken = (user: { id: number, role: string }): string => {
    return jwt.sign(
        {
            id: user.id,
            role: user.role,
        } as JWTPayload,
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
    )
}