import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from 'app/lib/supabaseClient';
import { BlogPost } from 'app/types/database.types';
import { verifyJwt } from 'app/lib/auth';

export async function GET() {
  try {
    const { data, error, statusText } = await supabaseClient.from('blog').select('*');
    if (error) {
      console.error('[API/blog/GET] Supabase error:', { message: error.message, details: error.details, hint: error.hint, code: error.code });
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }
    return NextResponse.json(data as BlogPost[], { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[API/blog/GET] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
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
    if (!body.title || !body.content || !body.excerpt || !body.category || !body.slug) {
      return NextResponse.json({ error: 'Missing required fields: title, content, excerpt, category, slug' }, { status: 400 });
    }
    const { data, error } = await supabaseClient
      .from('blog')
      .insert({ ...body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() })
      .select()
      .single();
    if (error) {
      console.error('[API/blog/POST] Supabase error:', { message: error.message, details: error.details, hint: error.hint, code: error.code });
      return NextResponse.json({ error: error.message, details: error.details }, { status: 500 });
    }
    return NextResponse.json(data as BlogPost, { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[API/blog/POST] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error', details: err instanceof Error ? err.message : 'Unknown error' }, { status: 500 });
  }
}