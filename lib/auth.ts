import jwt from 'jsonwebtoken';
import { JwtPayload } from 'app/types/database.types';

export function signJwt(payload: Omit<JwtPayload, 'expire_at'>): string {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const expireTime = now + 3600; // 1 hour from now

    return jwt.sign(
        { ...payload, expire_at: expireTime },
        secretKey,
        { expiresIn: '1h' }
    );
}

export function verifyJwt(token: string): JwtPayload | null {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    try {
        const decoded = jwt.verify(token, secretKey) as JwtPayload;
        const now = Math.floor(Date.now() / 1000);
        
        if (decoded.expire_at < now) {
            return null; // Token has expired
        }
        
        return decoded;
    } catch {
        return null;
    }
}