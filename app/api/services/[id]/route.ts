import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { Service } from 'app/types/database.types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseClient.from('services').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Service);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { data, error } = await supabaseClient.from('services').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Service);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseClient.from('services').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}