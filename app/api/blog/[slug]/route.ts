import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { BlogPost } from 'app/types/database.types';

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  const { data, error } = await supabaseClient.from('blog_posts').select('*').eq('slug', params.slug).single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as BlogPost);
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  const body = await request.json();
  const { data, error } = await supabaseClient.from('blog_posts').update(body).eq('slug', params.slug).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data as BlogPost);
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  const { error } = await supabaseClient.from('blog_posts').delete().eq('slug', params.slug);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}