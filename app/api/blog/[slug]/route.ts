import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { BlogPost } from 'app/types/database.types';
import { verifyJwt } from 'app/lib/auth';

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { data, error } = await supabaseClient
      .from('blog')
      .select('*')
      .eq('slug', params.slug)
      .single();
    if (error || !data) {
      console.error('[API/blog/[slug]/GET] Supabase error:', { message: error?.message, details: error?.details, hint: error?.hint, code: error?.code });
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json(data as BlogPost, { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[API/blog/[slug]/GET] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = req.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = verifyJwt(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
    const body = await req.json();
    // Validate required fields
    if (!body.title || !body.content || !body.excerpt || !body.category) {
      return NextResponse.json({ error: 'Missing required fields: title, content, excerpt, category' }, { status: 400 });
    }
    const { data, error } = await supabaseClient
      .from('blog')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('slug', params.slug)
      .select()
      .single();
    if (error || !data) {
      console.error('[API/blog/[slug]/PUT] Supabase error:', { message: error?.message, details: error?.details, hint: error?.hint, code: error?.code });
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json(data as BlogPost, { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[API/blog/[slug]/PUT] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const token = req.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const decoded = verifyJwt(token);
  if (!decoded) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
    const { error } = await supabaseClient
      .from('blog')
      .delete()
      .eq('slug', params.slug);
    if (error) {
      console.error('[API/blog/[slug]/DELETE] Supabase error:', { message: error.message, details: error.details, hint: error.hint, code: error.code });
      return NextResponse.json({ error: 'Blog post not found' }, { status: 404 });
    }
    return NextResponse.json({}, { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[API/blog/[slug]/DELETE] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}