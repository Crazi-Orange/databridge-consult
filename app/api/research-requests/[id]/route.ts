import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { ResearchRequest } from 'app/types/database.types';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseClient.from('research_requests').select('*').eq('id', params.id).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as ResearchRequest);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const body = await request.json();
  const { data, error } = await supabaseClient.from('research_requests').update(body).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as ResearchRequest);
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const { error } = await supabaseClient.from('research_requests').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}