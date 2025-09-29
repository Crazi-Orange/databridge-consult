import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { Service } from 'app/types/database.types';
import { verifyJwt } from 'app/lib/auth';

export async function GET() {
  const { data, error } = await supabaseClient.from('services').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Service[]);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get('auth_token')?.value;
  if (!token || !verifyJwt(token)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { data, error } = await supabaseClient.from('services').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Service);
}