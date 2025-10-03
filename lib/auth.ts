// app/lib/auth.ts
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'app/types/database.types';

export function signJwt(payload: Omit<JwtPayload, 'expire_at'>): string {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    console.error('JWT_SECRET environment variable is not set');
    throw new Error('JWT_SECRET environment variable is not set');
  }
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const expireTime = now + 3600; // 1 hour from now

  const token = jwt.sign({ ...payload, expire_at: expireTime }, secretKey, { expiresIn: '1h' });
  console.log('Generated JWT:', { payload, expire_at: expireTime, token });
  return token;
}

export function verifyJwt(token: string): JwtPayload | null {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    console.error('JWT_SECRET environment variable is not set');
    throw new Error('JWT_SECRET environment variable is not set');
  }
  try {
    const decoded = jwt.verify(token, secretKey) as JwtPayload;
    const now = Math.floor(Date.now() / 1000);
    if (decoded.expire_at < now) {
      console.error('Token expired:', { token, expire_at: decoded.expire_at, now });
      return null;
    }
    console.log('Token verified:', { decoded });
    return decoded;
  } catch (error) {
    console.error('JWT verification error:', { token, error });
    return null;
  }
}