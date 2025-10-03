import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from 'app/lib/supabaseAdmin';
import { signJwt } from 'app/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Handling /api/auth/login POST request');
    const { email, password } = await request.json();
    if (!email || !password) {
      console.error('Missing email or password:', { email });
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.from('users').select('*').eq('email', email).single();
    if (error || !data) {
      console.error('User not found:', { email, error });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const match = await bcrypt.compare(password, data.password_hash);
    if (!match) {
      console.error('Invalid password for user:', { email });
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = signJwt({
      id: data.id,
      email: data.email,
      role: data.role,
    });

    const { password_hash: _, ...safeUserData } = data;
    const response = NextResponse.json({ user: safeUserData }, { status: 200 });
    response.cookies.set('auth_token', token, {
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 3600,
    });

    console.log('Login successful, cookie set:', { userId: data.id, role: data.role });
    return response;
  } catch (error) {
    console.error('Login endpoint error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  console.log('Invalid GET request to /api/auth/login');
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}