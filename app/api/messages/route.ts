import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { Message } from 'app/types/database.types';
import { verifyJwt } from 'app/lib/auth';

export async function GET() {
  const { data, error } = await supabaseClient.from('messages').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Message[]);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = verifyJwt(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { data, error } = await supabaseClient
    .from('messages')
    .insert({ ...body, sender_id: decoded.id })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Message);
}