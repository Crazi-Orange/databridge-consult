import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from 'app/lib/supabaseAdmin';
import { User } from 'app/types/database.types';

export async function GET() {
  const { data, error } = await supabaseAdmin.from('users').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as User[]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('users').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as User);
}