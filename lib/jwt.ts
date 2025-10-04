import { v4 as uuidv4 } from 'uuid';
import jwt from 'jsonwebtoken';
import { JwtPayload, RefreshTokenPayload, ApiResponseLike } from 'app/types/database.types';
import { logError, logInfo } from './utils/logger';
import { JWT_EXPIRY_SECONDS, REFRESH_TOKEN_EXPIRY_SECONDS } from './config/auth.config';
import { getAuthCookies } from './cookies';
import type { NextResponse, NextRequest } from 'next/server';
import { usersDB } from './supabase';


interface JwtError {
  error: string;
  code: 'MISSING_SECRET' | 'SIGN_FAILED' | 'VERIFICATION_FAILED' | 'TOKEN_EXPIRED' | 'INVALID_TOKEN' | 'TOKEN_BLACKLISTED' | 'MISSING_TOKEN';
  details?: string;
}

interface BlacklistedToken {
  token: string;
  exp: number;
}

const ISSUER = 'databridge-consult';
const tokenBlacklist = new Map<string, BlacklistedToken>();

function cleanupBlacklist() {
  const now = Math.floor(Date.now() / 1000);
  for (const [token, { exp }] of tokenBlacklist) {
    if (exp < now) {
      tokenBlacklist.delete(token);
    }
  }
}

export function blacklistToken(token: string, response: ApiResponseLike | NextResponse): boolean | JwtError {
  try {
    const secretKey = process.env.JWT_SECRET;
    if (!secretKey) {
      const errorMessage = 'JWT_SECRET environment variable is not set';
      logError(errorMessage);
      return { error: errorMessage, code: 'MISSING_SECRET' };
    }

  const decoded = jwt.verify(token, secretKey) as JwtPayload | RefreshTokenPayload;
  const exp = decoded.exp ?? Math.floor(Date.now() / 1000);
    tokenBlacklist.set(token, { token, exp });
    logInfo('Token blacklisted', { token, exp });

    // Clear cookies if blacklisting auth or refresh token
    // Clear cookies via NextResponse API
    try {
      // If response looks like a NextResponse with cookies API, delete them
      const resp = response as unknown as { cookies?: { delete: (k: string) => void } };
      if (resp && resp.cookies && typeof resp.cookies.delete === 'function') {
        resp.cookies.delete('auth_token');
        resp.cookies.delete('refresh_token');
      }
    } catch (e) {
      logError('Failed to clear cookies during token blacklisting', { token, error: e });
    }

    cleanupBlacklist();
    return true;
  } catch (error: unknown) {
    const errorMessage = 'Failed to blacklist token';
    logError(errorMessage, { error });
    return {
      error: errorMessage,
      code: 'INVALID_TOKEN',
      details: error instanceof Error ? error.message : 'Invalid token',
    };
  }
}

export function isTokenBlacklisted(token: string): boolean {
  cleanupBlacklist();
  return tokenBlacklist.has(token);
}

export function signJwt(
  payload: Omit<JwtPayload, 'exp' | 'iat' | 'iss'>
): string | JwtError {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    const errorMessage = 'JWT_SECRET environment variable is not set';
    logError(errorMessage);
    return { error: errorMessage, code: 'MISSING_SECRET' };
  }

  try {
    const authToken = jwt.sign({ ...payload, iss: ISSUER }, secretKey, { expiresIn: JWT_EXPIRY_SECONDS });
    logInfo('Generated JWT', { payload, authToken });
    return authToken;
  } catch (error: unknown) {
    const errorMessage = 'Failed to sign JWT';
    logError(errorMessage, { error });
    return {
      error: errorMessage,
      code: 'SIGN_FAILED',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function signRefreshToken(
  payload: Omit<JwtPayload, 'exp' | 'iat' | 'iss'>
): Promise<string | JwtError> {
  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    const errorMessage = 'JWT_SECRET environment variable is not set';
    logError(errorMessage);
    return { error: errorMessage, code: 'MISSING_SECRET' };
  }

  try {
    const refreshId = uuidv4();
    const refreshToken = jwt.sign(
      { ...payload, iss: ISSUER, refresh_id: refreshId },
      secretKey,
      { expiresIn: REFRESH_TOKEN_EXPIRY_SECONDS }
    );

    const session = await usersDB.createSession({
      user_id: payload.sub,
      refresh_token: refreshToken,
      expires_at: new Date(Date.now() + REFRESH_TOKEN_EXPIRY_SECONDS * 1000).toISOString(),
    });

    if (!session) {
      logError('Failed to create session for refresh token', { userId: payload.sub });
      return { error: 'Failed to create session', code: 'SIGN_FAILED', details: 'Session creation failed' };
    }

    logInfo('Generated refresh token and created session', { payload, refreshId });
    return refreshToken;
  } catch (error: unknown) {
    const errorMessage = 'Failed to sign refresh token';
    logError(errorMessage, { error });
    return {
      error: errorMessage,
      code: 'SIGN_FAILED',
      details: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export function verifyJwt(request: { headers?: { cookie?: string } } | NextRequest): JwtPayload | JwtError {
  const reqForCookies = request as Parameters<typeof getAuthCookies>[0];
  const cookies = getAuthCookies(reqForCookies);
  const token = cookies.authToken;

  if (!token) {
    logError('No auth token found in cookies');
    return { error: 'No auth token provided', code: 'MISSING_TOKEN' };
  }

  if (isTokenBlacklisted(token)) {
    logError('Token is blacklisted', { token });
    return { error: 'Token is blacklisted', code: 'TOKEN_BLACKLISTED' };
  }

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    const errorMessage = 'JWT_SECRET environment variable is not set';
    logError(errorMessage);
    return { error: errorMessage, code: 'MISSING_SECRET' };
  }

  try {
    const decoded = jwt.verify(token, secretKey, { issuer: ISSUER }) as JwtPayload;
    logInfo('Access token verified', { decoded });
    return decoded;
  } catch (error: unknown) {
  if ((error as Error).name === 'TokenExpiredError') {
      logError('Access token expired', { token });
      return { error: 'Invalid or expired session', code: 'TOKEN_EXPIRED', details: (error as Error).message };
    }

    logError('Access token verification failed', { token, error });
    return {
      error: 'Invalid or expired session',
      code: 'VERIFICATION_FAILED',
      details: error instanceof Error ? error.message : 'Invalid token',
    };
  }
}

/**
 * Verify a raw JWT token string (server-side helper)
 * Accepts a token string and returns JwtPayload or JwtError
 */
export function verifyJwtFromToken(token: string): JwtPayload | JwtError {
  if (!token) {
    logError('No auth token provided to verifyJwtFromToken');
    return { error: 'No auth token provided', code: 'MISSING_TOKEN' };
  }

  if (isTokenBlacklisted(token)) {
    logError('Token is blacklisted', { token });
    return { error: 'Token is blacklisted', code: 'TOKEN_BLACKLISTED' };
  }

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    const errorMessage = 'JWT_SECRET environment variable is not set';
    logError(errorMessage);
    return { error: errorMessage, code: 'MISSING_SECRET' };
  }

  try {
    const decoded = jwt.verify(token, secretKey, { issuer: ISSUER }) as JwtPayload;
    logInfo('Access token verified (from raw token)', { decoded });
    return decoded;
  } catch (error: unknown) {
  if ((error as Error).name === 'TokenExpiredError') {
      logError('Access token expired', { token });
      return { error: 'Invalid or expired session', code: 'TOKEN_EXPIRED', details: (error as Error).message };
    }

    logError('Access token verification failed', { token, error });
    return {
      error: 'Invalid or expired session',
      code: 'VERIFICATION_FAILED',
      details: error instanceof Error ? error.message : 'Invalid token',
    };
  }
}

export function verifyRefreshToken(request: { headers?: { cookie?: string } } | NextRequest): RefreshTokenPayload | JwtError {
  const reqForCookies2 = request as Parameters<typeof getAuthCookies>[0];
  const cookies = getAuthCookies(reqForCookies2);
  const token = cookies.refreshToken;

  if (!token) {
    logError('No refresh token found in cookies');
    return { error: 'No refresh token provided', code: 'MISSING_TOKEN' };
  }

  if (isTokenBlacklisted(token)) {
    logError('Refresh token is blacklisted', { token });
    return { error: 'Token is blacklisted', code: 'TOKEN_BLACKLISTED' };
  }

  const secretKey = process.env.JWT_SECRET;
  if (!secretKey) {
    const errorMessage = 'JWT_SECRET environment variable is not set';
    logError(errorMessage);
    return { error: errorMessage, code: 'MISSING_SECRET' };
  }

  try {
    const decoded = jwt.verify(token, secretKey, { issuer: ISSUER }) as RefreshTokenPayload;
    logInfo('Refresh token verified', { decoded });
    return decoded;
  } catch (error: unknown) {
  if ((error as Error).name === 'TokenExpiredError') {
      logError('Refresh token expired', { token });
      return { error: 'Invalid or expired refresh token', code: 'TOKEN_EXPIRED', details: (error as Error).message };
    }

    logError('Refresh token verification failed', { token, error });
    return {
      error: 'Invalid or expired refresh token',
      code: 'VERIFICATION_FAILED',
      details: error instanceof Error ? error.message : 'Invalid token',
    };
  }
}