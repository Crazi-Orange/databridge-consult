import { NextRequest, NextResponse } from 'next/server';
import { verifyJwt } from 'app/lib/auth';
import { supabaseAdmin } from 'app/lib/supabaseAdmin';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth_token');
    if (!token) {
      console.log('No auth_token cookie found in /api/auth/me');
      return NextResponse.json({ error: 'No session found' }, { status: 401 });
    }

    const payload = verifyJwt(token.value);
    if (!payload) {
      console.log('Token verification failed in /api/auth/me:', { token: token.value });
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    const { data, error } = await supabaseAdmin
      .from('users')
      .select('id, email, role')
      .eq('id', payload.id)
      .single();

    if (error || !data) {
      console.log('User not found in /api/auth/me:', { userId: payload.id, error });
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    console.log('User session fetched in /api/auth/me:', { userId: data.id, role: data.role });
    return NextResponse.json({ user: data });
  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}