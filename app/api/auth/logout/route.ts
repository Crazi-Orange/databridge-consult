// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: 'Logged out' });
  response.cookies.set('auth_token', '', {
    httpOnly: true,
    path: '/',
    maxAge: 0, // Expire the cookie immediately
  });
  return response;
}