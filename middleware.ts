// app/middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  console.log('Middleware processing:', pathname);
  if (pathname.startsWith('/dashboard')) {
    console.log('Dashboard request headers:', Object.fromEntries(request.headers));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'], // Apply to all /dashboard sub-routes
};