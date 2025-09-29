import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { Product } from 'app/types/database.types';

export async function GET() {
  const { data, error } = await supabaseClient.from('products').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Product[]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabaseClient.from('products').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as Product);
}