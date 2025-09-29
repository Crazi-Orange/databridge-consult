import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { supabaseAdmin } from 'app/lib/supabaseAdmin';
import { signJwt } from 'app/lib/auth';

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  const { data, error } = await supabaseAdmin.from('users').select('*').eq('email', email).single();

  if (error || !data) return NextResponse.json({ error: 'User not found' }, { status: 404 });

  const match = await bcrypt.compare(password, data.password_hash);
  if (!match) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });

  // Create JWT payload with required fields
  const token = signJwt({
    id: data.id,
    email: data.email,
    role: data.role,
    created_at: Math.floor(new Date(data.created_at).getTime() / 1000) // Convert to Unix timestamp
  });

  // Remove sensitive data before sending response
  const { password_hash: _, ...safeUserData } = data;
  const response = NextResponse.json({ user: safeUserData });
  response.cookies.set('auth_token', token, { 
    httpOnly: true, 
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  return response;
}