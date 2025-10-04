import { JWT_EXPIRY_SECONDS, REFRESH_TOKEN_EXPIRY_SECONDS } from './config/auth.config';
import { logError, logInfo } from './utils/logger';
import type { NextRequest, NextResponse } from 'next/server';


interface AuthCookies {
  authToken?: string;
  refreshToken?: string;
}

export function setAuthCookies(response: NextResponse, accessToken: string, refreshToken: string): NextResponse {
  // Use NextResponse.cookies API to set httpOnly cookies
  try {
    response.cookies.set('auth_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: JWT_EXPIRY_SECONDS,
    });

    response.cookies.set('refresh_token', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: REFRESH_TOKEN_EXPIRY_SECONDS,
    });

    logInfo('Auth cookies set successfully (NextResponse)');
    return response;
  } catch (error) {
    logError('Failed to set auth cookies (NextResponse)', { error });
    return response;
  }
}

export function clearAuthCookies(response: NextResponse): NextResponse {
  try {
  response.cookies.delete('auth_token');
  response.cookies.delete('refresh_token');
    logInfo('Auth cookies cleared successfully (NextResponse)');
    return response;
  } catch (error) {
    logError('Failed to clear auth cookies (NextResponse)', { error });
    return response;
  }
}

export function getAuthCookies(request: { headers?: { cookie?: string } } | NextRequest): AuthCookies {
  try {
    const cookies: Record<string, string> = {};
    // Support both plain object with headers.cookie and NextRequest where headers.get('cookie') is used
    let cookieHeader: string | undefined;
    const headersObj = (request as unknown as { headers?: unknown }).headers;
    if (headersObj && typeof (headersObj as { get?: unknown }).get === 'function') {
      cookieHeader = (headersObj as { get: (name: string) => string | null }).get('cookie') || undefined;
    } else if (headersObj && typeof (headersObj as Record<string, unknown>)['cookie'] === 'string') {
      cookieHeader = (headersObj as Record<string, unknown>)['cookie'] as string;
    } else {
      cookieHeader = undefined;
    }

    if (cookieHeader) {
      cookieHeader.split(';').forEach((cookie) => {
        const [name, value] = cookie.trim().split('=');
        cookies[name] = decodeURIComponent(value);
      });
    }

    const result: AuthCookies = {
      authToken: cookies['auth_token'],
      refreshToken: cookies['refresh_token'],
    };

    logInfo('Auth cookies retrieved', {
      hasAuthToken: !!result.authToken,
      hasRefreshToken: !!result.refreshToken,
    });

    return result;
  } catch (error) {
    logError('Failed to retrieve auth cookies', { error });
    return {};
  }
}

// serializeCookieOptions removed after switching to NextResponse.cookies API