import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from './lib/auth';

const protectedRoutes = [
  '/dashboard',
  '/api/services',
  '/api/products',
  '/api/orders',
  '/api/research-requests',
  '/api/messages',
  '/api/users',
];

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  const url = req.nextUrl.pathname;

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

    if (url.startsWith('/api')) {
      const role = decoded.role;
      if (
        (url.startsWith('/api/users') && role !== 'superadmin') ||
        (url.startsWith('/api/services') && role !== 'admin' && role !== 'superadmin') ||
        (url.startsWith('/api/orders') && role !== 'admin' && role !== 'superadmin')
      ) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};