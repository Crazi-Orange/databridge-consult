import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './lib/auth';

const protectedRoutes = [
  '/dashboard',
  '/api/orders',
  '/api/research-requests',
  '/api/messages',
  '/api/users',
];

const protectedWriteRoutes = [
  '/api/services', // Only POST, PUT, DELETE need authentication
  '/api/products', // Only POST, PUT, DELETE need authentication
  '/api/blog',     // Only POST, PUT, DELETE need authentication
];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const url = req.nextUrl.pathname;
  const method = req.method;

  // Protect write operations for /api/services, /api/products, and /api/blog
  if (protectedWriteRoutes.includes(url) && method !== 'GET') {
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: No token provided' }, { status: 401 });
    }
    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }
    if (decoded.role !== 'admin' && decoded.role !== 'superadmin') {
      return NextResponse.json({ error: 'Forbidden: Admin or Superadmin access required' }, { status: 403 });
    }
  }

  // Protect other routes
  if (protectedRoutes.some(route => url.startsWith(route))) {
    if (!token) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    const decoded = verifyJwt(token);
    if (!decoded) {
      return NextResponse.redirect(new URL('/auth/login', req.url));
    }
    if (url.startsWith('/dashboard')) {
      const role = decoded.role;
      if (
        (url.startsWith('/dashboard/user') && role !== 'user' && role !== 'admin' && role !== 'superadmin') ||
        (url.startsWith('/dashboard/admin') && role !== 'admin' && role !== 'superadmin') ||
        (url.startsWith('/dashboard/superadmin') && role !== 'superadmin')
      ) {
        return NextResponse.redirect(new URL('/dashboard/user', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};