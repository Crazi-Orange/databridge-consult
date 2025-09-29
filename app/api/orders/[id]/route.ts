import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { Order } from 'app/types/database.types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseClient.from('orders').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Order);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { data, error } = await supabaseClient.from('orders').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Order);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseClient.from('orders').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}