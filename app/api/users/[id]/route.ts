import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from 'app/lib/supabaseAdmin';
import { User } from 'app/types/database.types';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseAdmin.from('users').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as User);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const body = await req.json();
  const { data, error } = await supabaseAdmin.from('users').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as User);
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseAdmin.from('users').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}