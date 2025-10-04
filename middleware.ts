import { NextRequest, NextResponse } from 'next/server';
import { logInfo } from './lib/utils/logger';

const SENSITIVE_HEADERS = ['cookie', 'authorization', 'x-api-key', 'x-auth-token'];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const isAuthPage = pathname.startsWith('/auth');
  const isDashboard = pathname.startsWith('/dashboard');

  // Strip sensitive headers before logging
  const headers: Record<string, string> = {};
  for (const [key, value] of request.headers) {
    if (!SENSITIVE_HEADERS.includes(key.toLowerCase())) {
      headers[key] = value;
    }
  }
  logInfo('Middleware processing', { pathname, headers });

  // Check authentication status via API route
  const meUrl = new URL('/api/auth/me', request.url);
  const cookieHeader = request.headers.get('cookie') || '';
  let user = null;

  try {
    const meRes = await fetch(meUrl.toString(), {
      method: 'GET',
      headers: { cookie: cookieHeader },
    });

    if (meRes.ok) {
      const body = await meRes.json();
      user = body?.data?.user || null;
    }
  } catch (err) {
    logInfo('Error calling /api/auth/me', { error: err });
  }

  // --- Redirect logic ---
  if (!user && isDashboard) {
    // Not logged in → trying to access dashboard
    logInfo('Unauthorized dashboard access attempt', { pathname });
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthPage) {
    // Already logged in → trying to visit login or register
    logInfo('Authenticated user accessing auth page, redirecting', { user });
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Otherwise, continue
  const response = NextResponse.next();
  if (user?.id) response.headers.set('x-user-id', user.id);
  return response;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/auth/:path*', // apply to login/register too
  ],
};
